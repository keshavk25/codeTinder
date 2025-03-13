const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        trim:true,
        minLength : 3,
        maxLength: 50,
    },
    lastName:{
        type:String,
        trim:true,
        minLength : 0,
        maxLength: 50
    },
    age:{
        type:Number,
        trim:true,
        min:18
    },
    gender:{
        type:String,
        trim:true,
        validate(value){
            if(!["male","female","other"].includes(value.toLowerCase())){
                throw new Error("Gender data is not valid ");
            }
        }
    },
    emailId:{
        type:String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id : " + value);
            }
        }
    },
    password:{
        type:String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error(value + " is not a strong password");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK_-LT9HmxfBNTsC0A8wfvjtfxKh3GjexbQ&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error(value + " is not a Valid Url");
            }
        }
    },
    skills:{
        type: [String]
    },
    about:{
        type: String,
        default: "This is default value"
    },
    isPremium:{
        type:Boolean,
        default: false,
    },
    membershipType:{
        type:String, 
    }
},
{
    timestamps:true,
});

userSchema.methods.getJWT =async function(){
    const user = this;
    const token =  await jwt.sign({_id: user._id}, "Code@tinder",
    {expiresIn: "1d"}
    )
    return token;
}
 
userSchema.methods.validatePassword = async function(passwordEnterByUser){
    const user = this;
    const passwordHash = user.password;
   const isPasswordValid=  await bcrypt.compare(passwordEnterByUser,passwordHash)
return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);