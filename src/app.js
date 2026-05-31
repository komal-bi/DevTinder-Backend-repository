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
require("dotenv").config()
const cors = require("cors");
const paymentRouter = require("./routes/payment");
require('../utils/cron')

const app = express();

// middleware which converts json object to javascript object

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/",paymentRouter)

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server listening");
    });
  })
  .catch((error) => {
    console.log("Database cannot be connected", error);
  });
