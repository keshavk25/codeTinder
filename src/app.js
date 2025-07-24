const express = require ("express");
const app = express();
const db = require("./config/database");
const cookieParser =require("cookie-parser");
const http = require("http");

const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/request");
const {userRouter} = require("./routes/user");
const {chatRouter} = require("./routes/chat");
const {paymentRouter} = require("./routes/payment");
const {passwordRouter} = require("./routes/password");
const {editorRouter} = require("./routes/editor");

const cors = require("cors");
const initializeSocket  = require("./utils/socket");
require('dotenv').config();

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
app.use("/",chatRouter);
app.use("/",paymentRouter);
app.use("/",passwordRouter);
app.use("/",editorRouter);
app.use("/api",editorRouter);

const server = http.createServer(app);
initializeSocket(server);

db()
.then(()=>{
    console.log("db connection is successful");
    server.listen(process.env.PORT,()=>{
        console.log("server running on port "+ process.env.PORT);
        
    });
})
.catch((err)=>{
    console.error("database connection error")
    
})

