const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  active: {
    type: Boolean
  },
  expiresby: {
    type: Date
  }
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
