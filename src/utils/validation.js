const validator = require("validator");

const validationSignUpData = (req)=>{
    const {firstName,lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email id Not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
}

const validateEditProfile = (req)=>{
    const user = req.user;
    const allowedEditFields = [
        "username",
        "age",
        "gender",
        "about",
        "skills"
    ]

    const isEditAllowed = Object.keys(req.body).every(fields=>allowedEditFields.includes(fields));
    return isEditAllowed;
}

module.exports = {validationSignUpData,validateEditProfile};