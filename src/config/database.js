const mongoose = require("mongoose");

const connectDB = async() => {
  await mongoose.connect(
    process.env.DATABASE_URL,
  );
  console.log("DB connection successfull");
};
module.exports={
    connectDB
}