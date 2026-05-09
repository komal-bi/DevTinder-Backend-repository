const express = require("express");
const { auth } = require("../Middleware/auth");

const app = express();

app.use("/user", auth, (req, res, next) => {
  try{
    throw new Error("Error")
  }catch(error){
    res.send(error)
  }
});

app.listen(7777, () => {
  console.log("server listening");
});
