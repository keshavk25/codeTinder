const express = require("express");
const User = require("../models/user");
const crypto = require("crypto");
const Otp = require("../models/otp");
const sendEmail = require("../services/email.service");
const bcrypt = require("bcrypt");
const { error } = require("console");

const passwordRouter = express.Router();

passwordRouter.post("/validate/user/generate-otp",async (req,res)=>{
    try{

        const {emailId} = req.body;

        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new error("Invalid crendentials");
        }
        
        const OTP = crypto.randomInt(100000,999999).toString();
        
        await Otp.findOneAndUpdate({userEmailId : emailId},{otp :OTP,createdAt : new Date()},{upsert:true});

        await sendEmail(emailId,"Request for reset password",
            `This mail is from DevCircle . OTP for reset your password is : <strong><i>${OTP}<i></strong>`,
            
        )

        res.json({message : "OTP sent successfully",
        });
 
    }catch(err){
        res.status(500).json("Invalid Credentials");
    }
})

passwordRouter.post("/verify/otp", async (req,res)=>{
    try{
        const {emailId, otp} = req.body;

        const isOtpData = await Otp.findOne({userEmailId:emailId});


        if(!isOtpData || isOtpData.otp !== otp ){
            throw new Error("Invalid or expired OTP")
        }

        await Otp.deleteOne({userEmailId: emailId});
        res.json({message :"OTP verified "})

    }catch(err){
        res.status(500).json({message: err.message})
    }
})

passwordRouter.post("/password/reset" , async(req,res)=>{
    try{
        const {emailId,newPassword} =req.body;

        const user = await User.findOne({emailId});
        
        user.password = await bcrypt.hash(newPassword,10);

        user.save();
        res.json({message : "Password reset successfully"})

    }catch(err){
        res.status(500).json({message : "Something went wrong"})
    }
})

module.exports = {passwordRouter};