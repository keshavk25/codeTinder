const express = require ("express");

const app = express();

app.use("/",(req,res)=>{
    res.send("hello form server");
})
app.use("/about",(req,res)=>{
    res.send("About page");
}),
app.use("/contact",(req,res)=>{
    res.send("Contact Page");
})

app.listen(3000,()=>{
    console.log("server running on port 3000");
    
});