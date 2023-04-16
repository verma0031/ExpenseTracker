const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Expense = require('./models/expense');

const sequelize = require('./util/database');

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.post('/user/add-expense' , async(req, res, next) => {
    try{
    const expense = req.body.expense;
    const description = req.body.description;
    const category = req.body.category;

    console.log(expense , description , category);

    console.log("post request");

    const data = await Expense.create( {
        expense: expense,
        description: description,
        category: category
    })
    res.status(201).json({newUserDetail : data});
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    };
});

app. get ('/user/get-expense' , async (reg, res, next) => {
    const expense = await Expense .findAll();
    res.status (200) . json ({allUsers: expense} )
});

app.delete('/user/delete-expense/:id', async (req, res, next) => { 
    const uId = req.params. id;
    await Expense. destroy({where: {id: uId}});
    res.sendStatus (200);
})

sequelize.sync()
.then( () => {
    app.listen(1000);
})
.catch( err => console.log(err));