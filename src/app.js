const express = require("express");
const { auth, userAuth } = require("../Middleware/auth");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignupData, validateLoginData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

// middleware which converts json object to javascript object

app.use(express.json());

app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
    res.send("User added successfully");
  } catch (error) {
    res.status(401).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    validateLoginData(req.body);
    let user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    let dbpassword = user.password;
    let isValidPassword = await bcrypt.compare(password, dbpassword);
    if (!isValidPassword) {
      throw new Error("Invalid Credentials");
    } else {
      // create the token
      // let token = await jwt.sign({ _id: user._id }, "devTinder_6758",{expiresIn:'0s'});
      let token = await jwt.sign({ _id: user._id }, "devTinder_6758");
      // create a cookie and append the token inside it and append that cookie with response so that it sends with response
      // res.cookie("token", token,{expires:new Date(Date.now()+90000)});
      res.cookie("token", token);
      res.send("User login successfully!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  let user = req.user;
  res.send(user);
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  let user = req.user;
  res.send(`${user.firstName} sent connection request to you`);
});

// get one user from database using email

app.get("/user", async (req, res) => {
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

app.get("/feed", async (req, res) => {
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

app.delete("/user", async (req, res) => {
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

app.patch("/user/:id", async (req, res) => {
  let userId = req.params.id;
  let data = req.body;
  try {
    // await User.findByIdAndUpdate({_id:userId},data)
    let allowedUpdates = ["age", "photoUrl", "about", "skills"];
    let isAllow = Object.keys(data).every((k) => allowedUpdates.includes(k));
    console.log("isAllow", isAllow);
    if (!isAllow) {
      throw new Error(
        "User not updated because some fields are not allowed to be empty",
      );
    }
    let beforeUpdate = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log("beforeUpdate", beforeUpdate);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send(error);
  }
});

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("server listening");
    });
  })
  .catch((error) => {
    console.log("Database cannot be connected", error);
  });
