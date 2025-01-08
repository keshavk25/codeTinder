const express = require ("express");

const app = express();

app.get("/user/:id/:name/:password",(req,res)=>{
    console.log(req.params);
    res.send({firstName:"Keshav" , lastName: "Kumar"});
})

app.listen(3000,()=>{
    console.log("server running on port 3000");
    
});