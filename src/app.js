const express = require("express");
const { auth, userAuth } = require("../Middleware/auth");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignupData, validateLoginData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

// middleware which converts json object to javascript object

app.use(express.json());

app.use(cookieParser());  

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("server listening");
    });
  })
  .catch((error) => {
    console.log("Database cannot be connected", error);
  });
