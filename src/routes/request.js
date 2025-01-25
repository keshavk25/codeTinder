const express = require("express");
const {userAuth} = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest",userAuth, async(req,res)=>{
    try{
        const user= req.user;
        res.send(user.firstName + " sent connection request successfully");
    }
    catch(err){
        res.status(404).send("User is not login");
    }
})

module.exports = {requestRouter};