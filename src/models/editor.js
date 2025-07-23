const mongoose = require('mongoose');   

const editorSchema = new  mongoose.Schema({

    roomId:{
        type : String,
        required: true,
        unique: true
              
    },
    text:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }

})

editorSchema.index({createdAt:1},{expireAfterSeconds:2592000}); // after 30 days

module.exports = mongoose.model("Editor",editorSchema);