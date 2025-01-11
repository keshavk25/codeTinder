const userAuth = (req,res,next)=>{
    console.log("user");
    const authData = "abc";
    if(authData === "abc"){
        next();
    }else{
        res.status(401).send("Unauthorised access");
    }
}

const adminAuth = (req,res,next)=>{
    console.log("admin");
    const authData = "ab2c";
    if(authData === "abc"){
        next();
    }else{
        console.log("unauthorised admin");
        res.status(401).send("admin Unauthorised access");
    }
}

module.exports = {userAuth,adminAuth}