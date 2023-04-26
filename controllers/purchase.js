const Razorpay = require('razorpay');
const {JSON} = require('sequelize');
const Order = require('../models/order');
const userController = require('./user');


exports.purchasepremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        })
        const amount = 2500;

        console.log("Razorpay",rzp);
        console.log("\n\n\nHere");
        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            console.log("Order in creation is", order);
            if(err) {
                console.log(err);
                throw new Error("Error in creation",JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                console.log("After creating order", order);
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err);
            })
        })
    } catch(err){
        console.log("Error in purchase");
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

exports.updateTransactionStatus = async (req, res ) => {
    try {
        const { payment_id, order_id} = req.body;
        Order.findOne({where : {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                req.user.update({ispremiumuser: true})
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}
