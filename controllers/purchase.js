const Razorpay = require('razorpay');
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

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            console.log("Order in creation is", order);
            if(err) {
                throw new Error("Error in creation",JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
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
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}}) //2
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ ispremiumuser: true }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({sucess: true, message: "Transaction Successful", token: userController.generateAccessToken(userId,undefined , true) });
        }).catch((error ) => {
            throw new Error(error)
        })

        
                
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}