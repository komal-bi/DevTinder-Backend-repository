const express = require("express");
const { userAuth } = require("../../Middleware/auth");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const {
  validateProfileEditData,
  validatePasswordData,
} = require("../../utils/validate");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  let user = req.user;
  res.send(user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    let data = req.body;
    validateProfileEditData(data);
    let user = req.user;
    // let updatedProfile = await User.findByIdAndUpdate(user._id, data, {
    //   returnDocument: "after",
    // });
    Object.keys(data).forEach((key) => (user[key] = data[key]));
    await user.save();
    res.send({
      message: "Profile updated successfully!",
      //   data: updatedProfile,
      data: user,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    validatePasswordData(req.body);
    let user = req.user;
    let newPassword = req.body.password;
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send("Profile password has been updated!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = profileRouter;
