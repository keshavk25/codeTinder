const mongoose  = require("mongoose");

const db = async () => {
    await mongoose.connect(process.env.DATABASE_SECRET_KEY);
};

module.exports= db;