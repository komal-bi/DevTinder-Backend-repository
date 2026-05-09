const express = require("express");
const { auth } = require("../Middleware/auth");

const app = express();

app.use("/user", auth, (req, res, next) => {
  res.send("User data");
});

app.listen(7777, () => {
  console.log("server listening");
});
