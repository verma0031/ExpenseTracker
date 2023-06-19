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
        rzp.orders.create({amount, currency: "INR"}, async(err, order) => {
            console.log("Order in creation is", order);
            if(err) {
                console.log(err);
                throw new Error("Error in creation",JSON.stringify(err));
            }
            const userId = req.user.id;

            const userOrder = new Order({
                orderid: order.id,
                status: 'PENDING',
                userId: userId
            })
            await userOrder.save();

            return res.status(201).json({ order, key_id: rzp.key_id });
        })
    } catch(err){
        console.log("Error in purchase");
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

exports.updateTransactionStatus = async (req, res ) => {
    try {
        const { payment_id, order_id } = req.body;
    
        const order = await Order.findOne({ orderid: order_id });
        order.paymentid = payment_id;
        order.status = 'SUCCESSFUL';
        await order.save();
    
        req.user.ispremiumuser = true;
        await req.user.save();
    
        return res.status(202).json({
          success: true,
          message: 'Transaction Successful',
          token: userController.generateAccessToken(req.user.id, undefined, req.user.ispremiumuser)
        });
      } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' });
      }
}
