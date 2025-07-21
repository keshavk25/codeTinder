const editorContent ={};

const editorSocket = (io,socket)=>{

        socket.on("joinEditor",({roomId})=>{
            socket.join(roomId);
            socket.emit("syncContent",{content : editorContent[roomId] ||""});
        })

        socket.on("updateEditorContent",async({roomId,text})=>{
            try{
                editorContent[roomId] = text;
                socket.to(roomId).emit("updateEditorContent",{content:text})
            }catch(error){
                console.log(error);
            }
        })
    
}

module.exports = editorSocket;