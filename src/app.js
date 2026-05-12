const express = require("express");
const { auth } = require("../Middleware/auth");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");

const app = express();

// middleware which converts json object to javascript object

app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = req.body;

  let user = new User(data);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(401).send(`Error while adding user: ${error}`);
  }
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
    await User.findByIdAndDelete({_id:userId});
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// update the user from database

app.patch("/user",async(req,res)=>{
  let userId=req.body.userId;
  let data = req.body;
  try {
    // await User.findByIdAndUpdate({_id:userId},data)
    let beforeUpdate=await User.findByIdAndUpdate(userId,data,{returnDocument:'before'}) 
    console.log("beforeUpdate",beforeUpdate)
    res.send("User updated successfully")
  } catch (error) {
    res.status(400).send("Something went wrong")
  }
})

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("server listening");
    });
  })
  .catch((error) => {
    console.log("Database cannot be connected", error);
  });
