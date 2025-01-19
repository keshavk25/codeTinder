const mongoose = require("mongoose");

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
        trim: true
    },
    password:{
        type:String,
        required: true,
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