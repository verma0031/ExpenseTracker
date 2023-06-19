const express = require('express');

const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const Expense = require('./models/expense');
const User = require('./models/user');
const Forgotpassword = require('./models/forgotpassword');
const Order = require('./models/order');
const Razorpay = require('razorpay');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')


const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const app = express();

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, 'access.log'),
//     { flags: 'a' });

app.use(helmet());

// app.use(morgan('combined', {stream: accessLogStream}));

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);

app.use('/user', expenseRoutes);

app.use('/purchase', purchaseRoutes);

app.use('/premium', premiumFeatureRoutes);

app.use('/password', resetPasswordRoutes);


// app.delete('/user/delete-expense/:id', async (req, res, next) => { 
//     const uId = req.params. id;
//     await Expense. destroy({where: {id: uId}});
//     res.sendStatus (200);
// })


mongoose.connect('mongodb+srv://piyushv:fr5Cp8tHaAJ06R4N@cluster0.l7fuzif.mongodb.net/expense-tracker?retryWrites=true&w=majority')
.then(result => {
  app.listen(1000);
})
.catch(err => {
  console.log(err);
})