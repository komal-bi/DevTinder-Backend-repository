const express = require("express");
const { userAuth } = require("../../Middleware/auth");
const ConnectionRequest = require("../models/connection");
const { validateConnectionRequestData } = require("../../utils/validate");
const { User } = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      validateConnectionRequestData(req.params);
      let fromUserId = req.user._id;
      let toUserId = req.params?.toUserId;
      let status = req.params?.status;

      let user = await User.findById(toUserId);
      if (!user) {
        throw new Error(
          "No such person to whom you are trying to send connection request",
        );
      }

      let alreadyAvailable = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (alreadyAvailable) {
        throw new Error(
          "You cannot send connection request...either you have already sent connection request or you already received connection request from that user",
        );
      }

      let connection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connection.save();
      res.send("Connection sent successfully");
    } catch (error) {
      res.status(400).send({message:error.message});
    }
  },
);

requestRouter.post('/request/review/:status/:senderId',userAuth,async(req,res)=>{
try {

  let loggedInUser=req.user;
  let senderId=req.params.senderId;
  let status=req.params.status;

  let allowedStatus=['accepted','rejected']

  if(!allowedStatus.includes(status))
  {
    throw new Error("Please give appropriate status either accepted or rejected")
  }

 let connection= await ConnectionRequest.findOne({
    fromUserId:senderId,
    toUserId:loggedInUser._id,
    status:'interested'
  })

  if(!connection)
  {
    throw new Error("Connection request not found")
  }

  connection.status=status;
  let data=await connection.save();

  res.json({message:`Connection request ${status}`,data:data})

} catch (error) {
  res.status(400).send(error.message)
}
})

module.exports = requestRouter;
