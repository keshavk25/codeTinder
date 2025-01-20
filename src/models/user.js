const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minLength : 3,
        maxLength: 50
    },
    lastName:{
        type:String
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
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
        default:"https://media.licdn.com/dms/image/v2/D5603AQH1GKj8LPKVOg/profile-displayphoto-shrink_800_800/B56ZP9OaOCH0Ag-/0/1735120234897?e=1743033600&v=beta&t=kGuSndku4v64V9XxdajL0LdWMhKRM5mFUnnV07NEXuA",
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
    }
},
{
    timestamps:true,
}

)

module.exports = mongoose.model("User",userSchema);