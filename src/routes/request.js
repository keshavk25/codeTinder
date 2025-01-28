const express = require("express");
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User  = require("../models/user");const connectionRequest = require("../models/connectionRequest");
;


const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //If request sent to same id
        // if(toUserId==fromUserId){
        //     return res.status(404).json({message: "You can't send request to yourself"})
        // }

        if(!([ "interested","ignored"].includes(status))){
            return res.status(400).json({message: "Invalid status type : " + status})
        };

        //  If there is already connection request 
        const existingConnectionRequest =await ConnectionRequest.findOne({
            $or:[
            {fromUserId,toUserId},
            {fromUserId : toUserId,
             toUserId : fromUserId}
            ]
        })
        if(existingConnectionRequest)return res.status(400).json({message: "Connection request is already sent"})

        //If user is not in db
        const toUser= await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"User not found"})
        }

        const connection = ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })
        const data = await connection.save();        
        res.json({message : `${req.user.firstName} is ${status} ${toUser.firstName} profile`,
            data
        });
    }
    catch(err){
        res.status(404).json({message: err.message});
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res)=>{
try{
    const requestId = req.params.requestId;
    const loggedInUser = req.user;
    const status = req.params.status;

    if(!(["accepted", "rejected"].includes(status))){
       return res.status(404).json({message: "Status not allowed"});
    }
    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId : loggedInUser._id,
        status : "interested"
    })

    if(!connectionRequest){
        return res.status(404).json({message: "Connection request not found"})
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    res.json({message: `Request ${status}`}
    );}
    catch(err){
        res.status(404).json({
            message:err.message
        })
    }
})

module.exports = {requestRouter};