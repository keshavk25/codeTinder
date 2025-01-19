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
    res.status(400).send("Error Message : "+err.message)
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

app.delete("/user", async (req,res)=>{

const id= req.body.id;
console.log(id);
try{
    await User.findOneAndDelete(id);
    res.send("Deleted successfully");
}catch(err){
    res.status(404).send("something went wrong");
}

})

app.patch("/user/:userId", async(req,res)=>{
    const userId=req.params.userId;
    console.log(userId);
    
try{
    const data = req.body;
    const ALLOW_UPDATE= ["about", "gender", "age", "skills","password"];
    const isValidData = Object.keys(data).every((e)=>ALLOW_UPDATE.includes(e));

    if(!isValidData)throw new Error("Update not Allowed");
    if(data.skills.length>10)throw new Error("Skill should be less than 10");

   const user = await User.findByIdAndUpdate({_id : userId},req.body,
    {returnDocument:"after",
        runValidators:true
    }

    );
   console.log(user);
   res.send("User data updated");
}catch(err){
    res.status(404).send("Updated Failed : " + err.message);
}

})

app.use("/", (err,req,res,next )=>{
    if(err){
        res.status(500).send("Something is went wrong");
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

