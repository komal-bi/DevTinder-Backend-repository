const express = require("express");
const { User } = require("../models/user");
const { userAuth } = require("../../Middleware/auth");
const ConnectionRequest = require("../models/connection");
const userRouter = express.Router();

// get one user from database using email

userRouter.get("/user", async (req, res) => {
  let emailId = req.body.emailId;
  try {
    let user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(401).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// delete the user from database

userRouter.delete("/user", async (req, res) => {
  let userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// update the user from database

userRouter.patch("/user/:id", async (req, res) => {
  let userId = req.params.id;
  let data = req.body;
  try {
    // await User.findByIdAndUpdate({_id:userId},data)
    let allowedUpdates = ["age", "photoUrl", "about", "skills"];
    let isAllow = Object.keys(data).every((k) => allowedUpdates.includes(k));
    if (!isAllow) {
      throw new Error(
        "User not updated because some fields are not allowed to be empty",
      );
    }
    let beforeUpdate = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    let loggedInUserId = req.user._id;
    let connections = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "profileUrl"]);

    if (connections?.length) {
      res.send(connections);
    } else {
      res.status(401).send("No requests found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    let loggedinUser = req.user;

    let connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedinUser._id,
          status: "accepted",
        },
        {
          toUserId: loggedinUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "profileUrl"])
      .populate("toUserId", ["firstName", "lastName", "profileUrl"]);
    if (connections?.length) {
      let allConnections = connections.map((ele) => {
        if (ele.fromUserId.equals(loggedinUser._id)) {
          return ele.toUserId;
        }
        return ele.fromUserId;
      });
      res.send(allConnections);
    } else {
      res.status(401).send("No connections");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// get users from database

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user;
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;

    let connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select(["fromUserId", "toUserId"]);

    let hideFieldsSet = new Set();

    connections.map((ele) => {
      hideFieldsSet.add(ele.fromUserId.toString());
      hideFieldsSet.add(ele.toUserId.toString());
    });

    let hideFieldsArray = Array.from(hideFieldsSet);

    let users = await User.find({
      $and: [
        {
          _id: {
            $nin: hideFieldsArray,
          },
        },
        {
          _id: {
            $ne: loggedInUser._id,
          },
        },
      ],
    })
      .select(["firstName", "lastName"])
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
