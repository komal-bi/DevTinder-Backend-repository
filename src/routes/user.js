const express = require("express");
const { User } = require("../models/user");
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

// get users from database

userRouter.get("/feed", async (req, res) => {
  try {
    let users = await User.find({});
    if (users.length == 0) {
      res.status(401).send("Users not found");
    } else {
      res.send(users);
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

module.exports = userRouter;
