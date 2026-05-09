const express = require("express");

const app = express();

// multiple request handlers can be passed in app.use() or app.method()  method can be anything get post whatever



app.use("/user", (req, res, next) => {
  console.log("first");
  next();
});


app.use("/user", (req, res, next) => {
  console.log("second");
  next();
  res.send("second response");
});

app.use("/user/data", (req, res, next) => {
  console.log("third");
  // next();
});

app.use("/user", (req, res) => {
  console.log("fourth");
  res.send("fourth response");
});

app.listen(7777, () => {
  console.log("server listening");
});
