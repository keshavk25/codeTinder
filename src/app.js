const express = require ("express");
const app = express();
const db = require("./config/database");
const User = require("./models/user");

app.post("/signup", async(req,res)=>{
const user = User({
    firstName:"Keshav",
    lastName:"Kumar",
    age:21,
    email:"keshav@me.com",
    gender:"male"
})
try{
    await user.save();
    res.send("User info saved Successfully")
}
catch(err){
    res.status(400).send("User Info saved !!!!!!!!!!")
}

})


db()
.then(()=>{
    console.log("db connection is successful");
    app.listen(3000,()=>{
        console.log("server running on port 3000");
        
    });
})
.catch((err)=>{
    console.error("database connection error")
    
})

