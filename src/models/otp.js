const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

    userEmailId :{
        type : String,
        required :true,
        unique : true,
    },
    otp:{
        type: String,
        required:true,
    },
    createdAt :{
        type:Date,
        default : Date.now,
        
    }

})

otpSchema.index({createdAt:1},{expireAfterSeconds:600});

module.exports = new mongoose.model("Otp", otpSchema);