const express = require("express")
const {userAuth} = require("../middleware/auth")
const razorpayInstance = require("../utils/razorpay")
const Payment  = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require("../models/user");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create",userAuth,async(req,res)=>{
    try{
            const {membershipType} = req.body;
            const {firstName,lastName} = req.user;

        const order = await razorpayInstance.orders.create({
            amount:membershipAmount[membershipType]*100,
            currency: "INR",
            receipt: "receipt#1",
            notes:{
                firstName : firstName,
                lastName : lastName,
                membershipType : membershipType
            },
        })
        
        const {id,status, amount, currency, receipt,notes } = order;
        const payment = new Payment({
            userId: req.user._id,
            orderId:id,
            status:status,
            amount:amount,
            currency:currency,
            receipt:receipt,
            notes:notes,
        })
        const savedPayment = await payment.save();
        // res.send(order);
        res.json({...savedPayment.toJSON(), keyId:"rzp_test_a2fY8WwpOfa0kW"});
    }
    catch(err){
        console.log(err);
    }
})

paymentRouter.post("/payment/webhook",async(req,res)=>{
    try{
        
        const webhookSignature = req.header("X-Razorpay-Signature");
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature, 
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if(!isWebhookValid){
            return res.status(400).json({msg:"Webhook Signature is invaild"});
        }

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({orderId: paymentDetails.order_id});
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findOne({_id: payment.userId});
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();
        //   if(req.body.event === "payment.captured"){  
        //   }
        //   if(req.body.event === "payment.failed"){
        //   }

        return res.status(200).json({msg:"webhook received successfully "})

    }catch(err){
        console.log(err);
    }
})

module.exports = {paymentRouter};