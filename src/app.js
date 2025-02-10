const express = require ("express");
const app = express();
const db = require("./config/database");
const cookieParser =require("cookie-parser");

const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/request");
const {userRouter} = require("./routes/user");
const cors = require("cors");
require('dotenv').config()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

db()
.then(()=>{
    console.log("db connection is successful");
    app.listen(process.env.PORT,()=>{
        console.log("server running on port "+ process.env.PORT);
        
    });
})
.catch((err)=>{
    console.error("database connection error")
    
})

