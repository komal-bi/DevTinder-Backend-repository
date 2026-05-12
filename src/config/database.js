const mongoose = require("mongoose");

const connectDB = async() => {
  await mongoose.connect(
    "mongodb://kmore5004_db_user:Kiran2261@ac-l9a0epd-shard-00-00.eh5ohyr.mongodb.net:27017,ac-l9a0epd-shard-00-01.eh5ohyr.mongodb.net:27017,ac-l9a0epd-shard-00-02.eh5ohyr.mongodb.net:27017/devTinder?ssl=true&replicaSet=atlas-vx3w6f-shard-0&authSource=admin&appName=NamasteDev",
  );
  console.log("DB connection successfull");
};
module.exports={
    connectDB
}