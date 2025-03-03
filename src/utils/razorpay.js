const Razorpay =require("razorpay") ;
// console.log(process.env.RAZORPAY_KEY_ID)
// console.log(process.env.RAZORPAY_KEY_SECRET)
var instance = new Razorpay({
    key_id: "rzp_test_a2fY8WwpOfa0kW",
    key_secret: "xCXhnBBd4jpxrfaBf51ZsBBP",
  });

module.exports = instance; 