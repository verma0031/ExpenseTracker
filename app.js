const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Expense = require('./models/expense');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')
const Order = require('./models/order');
const Razorpay = require('razorpay');


const dotenv = require('dotenv');

dotenv.config();


const sequelize = require('./util/database');

const bcrypt = require('bcrypt');

const app = express();

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

Expense.belongsTo(User);
User.hasMany(Expense);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then( () => {
    app.listen(1000);
})
.catch( err => console.log(err));