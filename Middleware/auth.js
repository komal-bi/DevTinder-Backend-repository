const jwt = require("jsonwebtoken");
const { User } = require("../src/models/user");

const userAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.status(401).send({message:"Invalid token"});
    }

    let verificationData = await jwt.verify(token, "devTinder_6758");

    let { _id } = verificationData;
    let user =await  User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user=user;
    next();
  } catch (error) {
    console.log("error",error)
    res.status(400).send({message:error.message});
  }
};

module.exports = {
  userAuth,
};
