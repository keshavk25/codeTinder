const express  = require("express")
const editorRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const Editor = require("../models/editor");

const validateKey = (key)=>/^[a-zA-Z0-9]{6}$/.test(key);

editorRouter.get("/editor/join/:roomId",userAuth,async(req,res)=>{
    try{
        const {roomId} = req.params;

        if(!validateKey(roomId)){
            return res.status(400).json({message: "Invalid room ID"});
        }

        const editorData = await Editor.findOne({roomId: roomId});

        if(!editorData){
            return res.status(404).json({message: "Room not found"});
        }
        
        res.status(200).json({message: editorData});
    }catch(err){
        res.status(500).json({message: "Internal server error"});
    }
})

editorRouter.post("/editor/create/:roomId",userAuth,async(req,res)=>{
    try{
        const {roomId} = req.params;

        if(!validateKey(roomId)){
            return res.status(400).json({message: "Invalid room ID format"});
        }

        let editorData = await Editor.findOne({roomId});
        if(editorData){
            return res.status(400).json({message: "something went wrong"});
        }

        if(!editorData){
            editorData = new Editor({roomId:roomId,text:""});
            await editorData.save();
        }

        res.status(200).json({message: editorData});

    }catch(err){
        res.status(500).json({message: "Internal server error",error:err.message});
    }
})

module.exports = {editorRouter};