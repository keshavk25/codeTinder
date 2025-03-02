const mongoose = require("mongoose")

const paymentSchema =new  mongoose.Schema(
{
  userId:{
    type:mongoose.Types.ObjectId,
    required:true,
    ref:"User"
  },   
paymentId:{
    type:String
},
orderId:{
    type:String,
},
status:{
    type:String,
    required:true
},
amount:{
    type:Number,
    required: true
},
currency:{
    type:String,
    required : true,

},
receipt:{
    type:String,
    required:true
},
notes:{
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    membershipType:{
       type: String
    },
}



},
{
    timestamps:true
})

module.exports = new mongoose.model("Payment", paymentSchema)