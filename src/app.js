const express = require ("express");
const app = express();
const db = require("./config/database");
const User = require("./models/user");
const {validationSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser =require("cookie-parser");
const jwt = require("jsonwebtoken")

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async(req,res)=>{
try{
    //Validation of user data or req.body
    validationSignUpData(req);
        
    const {firstName, lastName, emailId, password} = req.body;
    //Rest field ignored(Like age)
    
    const passwordHash = await bcrypt.hash(password,10);

    const user = User({
        firstName,
        lastName,
        emailId,
        password : passwordHash
        
    });

    await user.save();
    res.send("User info saved Successfully")
}
catch(err){
    res.status(400).send("Error : "+err.message)
}

})

app.post("/login",async(req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user =await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){ 
            const token = await jwt.sign({_id:user._id},"Code@tinder");
            res.cookie("token",token);           
            res.send("Login successful");
        }
        else throw new Error("Invalid Credentials");

    }catch(err){
        res.status(400).send("Error : "+err.message)
    }
})

app.get("/profile",async (req,res)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
            throw new Error("Invalid token")
        }
        const decodedMessage=await jwt.verify(token,"Code@tinder");
        const {_id} =decodedMessage;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User does not exit");
        }
        res.send(user); 
 
    }catch(err){ 
        res.status(404).send("ERROR : " + err.message);
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
    const ALLOW_UPDATE= ["about", "gender", "age", "skills","password","photoUrl"];
    const isValidUpdate = Object.keys(data).every((e)=>ALLOW_UPDATE.includes(e));

    if(!isValidUpdate)throw new Error("Update not Allowed");
    if(data.skills.length>10)throw new Error("Skill should be less than 10");

   const user = await User.findByIdAndUpdate({_id : userId},req.body,
    {   returnDocument:"after",
        runValidators:true
    });
   console.log(user);
   res.send("User data updated");
}
catch(err){
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

