const express = require("express");
const User = require("../models/user");
const {validationSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async(req,res)=>{
    try{
        //Validation of user data or req.body
        validationSignUpData(req);
            
        const {firstName, lastName, emailId, password} = req.body;
        //Rest field ignored(Like age)
            
        const passwordHash = await bcrypt.hash(password,10);

        const user = User({
            firstName, 
            lastName,
            emailId,
            password : passwordHash
            
        });
    
        const savedUser = await user.save();

        const token =await savedUser.getJWT();
                res.cookie("token",token,{
                    expires:new Date(Date.now()+  1*3600000),
                });

        res.json({message:"User info saved Successfully",
            data : savedUser
        })
    }
    catch(err){
        res.status(400).send("Error : "+err.message)
    }
    
    })
    
authRouter.post("/login",async(req,res)=>{
        try{
            const {emailId, password} = req.body;
            const user =await User.findOne({emailId : emailId});
            if(!user){
                throw new Error("Invalid Credentials");
            }
    
            const isPasswordValid =await user.validatePassword(password);
    
            if(isPasswordValid){ 
                const token =await user.getJWT();
                res.cookie("token",token,{
                    expires:new Date(Date.now()+  1*3600000),
                }); 
                 res.send(user);
            }
            else throw new Error("Invalid Credentials");
    
        }catch(err){
            res.status(400).send("Error : "+err.message)
        }
    })

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,
        {
            expires: new Date(Date.now())
        }
    ).send("Logout successful");
})

module.exports = {authRouter};