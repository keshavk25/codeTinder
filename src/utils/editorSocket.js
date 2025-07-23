const Editor = require("../models/editor");

const liveUser = new Map();

const editorSocket = (io,socket)=>{

        socket.on("joinEditor",async ({roomId,userName,userId})=>{
            socket.join(roomId);
            socket.roomId = roomId;
            socket.userId = userId;
            socket.userName = userName;

            let data = await Editor.findOne({roomId:roomId});
            if(!data){
                data = new Editor({roomId:roomId,text:""});
                await data.save();
            }
            socket.emit("syncContent",{text : data.text});

            if(!liveUser.has(roomId)){
                liveUser.set(roomId,new Map());
            }
            liveUser.get(roomId).set(userId,userName);

            const users = Array.from(liveUser.get(roomId)).map(([id,name])=>({id,name}));
            io.to(roomId).emit("roomUsers",{users});

        })

        socket.on("updateEditorContent",async({roomId,text})=>{
            try{
                await Editor.findOneAndUpdate({roomId:roomId},
                    {text:text},
                    { new: true, upsert: true }
                );
               
                socket.to(roomId).emit("updateEditorContent",{text})
            }catch(error){
                console.log(error);
            }
        })

        socket.on("disconnect",()=>{
            const roomId = socket.roomId;
            const userId = socket.userId;
            const userName = socket.userName;

            if(roomId && liveUser.has(roomId)){
                liveUser.get(roomId).delete(userId);
                if(liveUser.get(roomId).size === 0){
                   liveUser.delete(roomId);
                }else{
                    const users = Array.from(liveUser.get(roomId)).map(([id,name])=>({id,name}));
                    io.to(roomId).emit("roomUsers",{users});
                }
            }
        })
}

module.exports = editorSocket;