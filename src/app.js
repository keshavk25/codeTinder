const express = require ("express");

const app = express();

// app.use("/",(req,res)=>{
//     res.send("hello form server");
// })

app.listen(3000,()=>{
    console.log("server running on port 3000");
    
});