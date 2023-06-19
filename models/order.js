const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  paymentid: {
    type: String
  },
  orderid: {
    type: String
  },
  status: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
