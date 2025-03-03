const Razorpay =require("razorpay") ;
// console.log(process.env.RAZORPAY_KEY_ID)
// console.log(process.env.RAZORPAY_KEY_SECRET)
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

module.exports = instance; 