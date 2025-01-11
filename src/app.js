const express = require ("express");
const {userAuth,adminAuth} = require("./middleware/auth");
const app = express();

    app.use("/user",userAuth);
    app.use("/admin",adminAuth,(req,res,next)=>{
        console.log("Authorised admin");
        res.send("Authorised admin");
    });

    app.get("/user/profile",(req,res,next)=>{
        console.log("user profile");
        res.send("Authorised access");
    })
    app.get("/user/delete",(req,res,next)=>{
        console.log("user delete");
        res.send("User Deleted");
    })

app.listen(3000,()=>{
    console.log("server running on port 3000");
    
});