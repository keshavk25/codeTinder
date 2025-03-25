const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest  = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user")

const REQUEST_USER_DATA = "firstName lastName age gender skills about photoUrl ";

userRouter.get("/user/requests/received", userAuth, async(req, res)=>{
try{

    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({toUserId : loggedInUser._id,
        status : "interested"
    })
    .populate("fromUserId",REQUEST_USER_DATA);
    res.json({message:"Data fetched successfully",
        data : connectionRequest
    });

}catch(err){
    res.status(404).json({message: err.message});
}

})

userRouter.get("/user/connection", userAuth ,async (req,res)=>{

try{

    const loggedInUser =req.user;

    const connection = await ConnectionRequest.find({
        $or:[{fromUserId : loggedInUser._id,status: "accepted"},
            {toUserId: loggedInUser._id,status: "accepted"}
        ]
    }).populate("fromUserId",REQUEST_USER_DATA)
    .populate("toUserId",REQUEST_USER_DATA);

    const data = connection.map((row)=> {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
    })
    res.json({
        message:"All Connections : " , 
        data :data
    })
}catch(err){
    res.status(404).json({message: err.message});
}

} )

userRouter.get("/user/connection/:withUserId", userAuth ,async (req,res)=>{

    try{
        const withUserId = req.params.withUserId;
        const loggedInUser =req.user;
    
        let data = await ConnectionRequest.findOne({
            $or:[{fromUserId : loggedInUser._id,status: "accepted", toUserId : withUserId},
                {fromUserId : withUserId,toUserId: loggedInUser._id,status: "accepted"}
            ]
        }).populate("fromUserId",REQUEST_USER_DATA)
        .populate("toUserId",REQUEST_USER_DATA);
    
        if(data.fromUserId._id.toString() === loggedInUser._id.toString()){
            data =  data.toUserId;
        }
        else{ data = data.fromUserId};
        
        res.json({
            message:"User Find : " , 
            data :data
        })
    }catch(err){
        res.status(404).json({message: err.message});
    }
    
    } )

userRouter.get("/user/request/send/review/:status/", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const status = req.params.status;
    
        if(!([ "rejected","interested"].includes(status))){
           return res.status(404).json({message: "Status not allowed"});
        }
        const connectionRequest = await ConnectionRequest.find({
            fromUserId : loggedInUser._id,
            status : status,
        }).populate("toUserId", REQUEST_USER_DATA)
    
        if(!connectionRequest){
            return res.status(404).json({message: "Connection request not found"})
        }
    
        const data = connectionRequest.map((row)=> row.toUserId )

        if(status === "interested"){
        return res.json({message:"Users that you send request : " , Data : data } );
        }
        else return res.json({message:"Users that reject your request : " , Data : data } )
    }
        catch(err){
            res.status(404).json({
                message:err.message
            })
        }
    })

userRouter.get("/feed", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50?50:limit;

        const skip = (page-1)*limit;

        const connectionRequest =await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId ")

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((row)=>{
            hideUserFromFeed.add(row.fromUserId.toString());
            hideUserFromFeed.add(row.toUserId.toString());
        })

        const data = await User.find({
           $and:[
            { _id : {$nin: Array.from(hideUserFromFeed)}},
            {_id : {$ne: loggedInUser._id }}
           ]
        }).select(REQUEST_USER_DATA)
        .skip(skip)
        .limit(limit);
        
        res.json({ 
            message : "Feed Users : ",
            data
        })

    }catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = {userRouter};