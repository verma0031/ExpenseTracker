const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Expense = require('./models/expense');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')

const sequelize = require('./util/database');

const bcrypt = require('bcrypt');

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);

app.use('/user', expenseRoutes);

// app.delete('/user/delete-expense/:id', async (req, res, next) => { 
//     const uId = req.params. id;
//     await Expense. destroy({where: {id: uId}});
//     res.sendStatus (200);
// })

Expense.belongsTo(User);
User.hasMany(Expense);

sequelize.sync()
.then( () => {
    app.listen(1000);
})
.catch( err => console.log(err));