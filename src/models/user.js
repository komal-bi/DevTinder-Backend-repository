const mongoose = require("mongoose");
const validator=require("validator")

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:true,
    minLength:4,
    maxLength:6
  },
  lastName: {
    type: String,
    required:true
  },
  emailId: {
    type: String,
    required:true,
    trim:true,
    unique:true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value))
      {
        throw new Error("Invalid Email")
      }
    }
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
    min:18,
    max:60
  },
  gender:{
    type:String,
    validate(value){
      if(!['male','female','others'].includes(value))
      {
        throw new Error("Not a valid gender")
      }
    }
  },
  profileUrl:{
    type:String,
    default:'https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg',
    validate(value){
      if(!validator.isURL(value))
      {
        throw new Error("Invalid url")
      }
    }
  },
  about:{
    type:String,
    default:"Hii this is about description"
  },
  skills:{
    type:[String]
  }
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
