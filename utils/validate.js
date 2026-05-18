
const validator = require('validator')

const validateSignupData=(data)=>{
    const {firstName,lastName,emailId,password}=data;
    if(!firstName)
    {
        throw new Error("Please enter first name")
    }
    else if(!lastName)
    {
        throw new Error("Please enter last name")
    }
    else if(!emailId)
    {
         throw new Error("Please enter email Id")
    }
    else if(!validator.isEmail(emailId))
    {
         throw new Error("Please enter valid email Id")
    }
    else if(!password)
    {
         throw new Error("Please enter password")
    }
    else if(!validator.isStrongPassword(password))
    {
         throw new Error("Please enter strong password")
    }
}

const validateLoginData=(data)=>{
    const {emailId,password}=data;

    if(!emailId)
    {
         throw new Error("Please enter email Id")
    }
    else if(!validator.isEmail(emailId))
    {
         throw new Error("Please enter valid email Id")
    }
    else if(!password)
    {
         throw new Error("Please enter password")
    }
}

module.exports ={
    validateSignupData,
    validateLoginData
}