const express = require("express");
const {
  validateSignupData,
  validateLoginData,
} = require("../../utils/validate");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

let authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    validateSignupData(req.body);

    const encryptedPassword = await bcrypt.hash(password, 10);

    let data = {
      firstName,
      lastName,
      emailId,
      password: encryptedPassword,
    };
    let user = new User(data);
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    validateLoginData(req.body);
    let user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    let dbpassword = user.password;
    let isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    } else {
      // create the token
      // let token = await jwt.sign({ _id: user._id }, "devTinder_6758",{expiresIn:'0s'});
      let token = await user.getJwt();
      // create a cookie and append the token inside it and append that cookie with response so that it sends with response
      // res.cookie("token", token,{expires:new Date(Date.now()+90000)});
      res.cookie("token", token);
      res.send(user);
    }
  } catch (error) {
    res.status(400).json({message:error.message});
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send({message:"Logout Successfully"});
});

module.exports = authRouter;
