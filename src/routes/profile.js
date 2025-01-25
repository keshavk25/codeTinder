const express = require("express");
const {userAuth} = require("../middleware/auth");
const {validateEditProfile, validateForgetPassword} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user")

const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
        const user = req.user;
        res.send(user); 
 
    }catch(err){ 
        res.status(404).send("ERROR : " + err.message);
    }
})

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    try{
       if(!validateEditProfile(req)){
            throw new Error("Invalid Edit Request");
       }
       const loggedInUser = req.user;
       console.log(loggedInUser);
       
       Object.keys(req.body).forEach(field => {
            loggedInUser[field] = req.body[field];
       });
       await loggedInUser.save();
       res.json({message:`${loggedInUser.firstName}, your profile updated successfully`,
        data : loggedInUser
    });
       
    }catch(err){
        res.status(404).send("Error : "+ err.message);
    }

})

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
try{

    const {emailId , oldPassword} = req.body;

    const user =await User.findOne({emailId:emailId});

    const isOldPasswordCorrect =await bcrypt.compare(oldPassword,user.password);
    if(!isOldPasswordCorrect){
        throw new Error("Please enter valid password");
    }    
    req.user.password = await bcrypt.hash(req.body.newPassword,10);
    console.log(req.user.password);
    req.user.save().send("password forget successfully")
    
}catch(err){
    res.status(404).send("Error : "+ err.message);
}
})

module.exports = {profileRouter};