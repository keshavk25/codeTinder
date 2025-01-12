const mongoose  = require("mongoose");

const db = async () => {
    await mongoose.connect("mongodb+srv://keshavks9810:Ke5sha1v23@mywebapp.s3dr6.mongodb.net/codetinder");
};

module.exports= db;