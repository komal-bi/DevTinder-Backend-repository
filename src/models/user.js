const mongoose = require("mongoose");
const validator=require("validator")
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:true,
    minLength:4,
    maxLength:6,
    // index:true
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
    // index:true,
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

userSchema.methods.getJwt=async function(){
  let user=this;
  let token=await jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  return token;
}

userSchema.methods.validatePassword=async function(password){
  let dbpassword=this.password;
  let isValidPass=await bcrypt.compare(password, dbpassword);
  return isValidPass;
}

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
