const express = require ("express");
const app = express();
const db = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async(req,res)=>{
const user = User(req.body)
try{
    await user.save();
    res.send("User info saved Successfully")
}
catch(err){
    res.status(400).send("User Info saved !!!!!!!!!!")
}

})

app.get("/user", async(req,res)=>{
    const userEmailId = req.body.emailId;
    try{        
        res.send( await User.find({emailId: userEmailId}));
    }
    catch(err){
        res.status(404).send("Somethig went wrong");
    }
})

app.use("/", (err,req,res,next )=>{
    if(err){res.status(500).send("Something is went wrong");}
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

