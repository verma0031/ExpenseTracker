const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Expense = require('./models/expense');
const User = require('./models/signup-user');

const sequelize = require('./util/database');

const bcrypt = require('bcrypt');

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

app.post('/user/signup' , async(req, res, next) => {
    try{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    console.log( email , password);

    console.log("post request");

    const data = await User.create( {
        name: name,
        email: email,
        password: password
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


app.post('/user/login', async(req, res, next) => {
        const { email, password } = req. body;
        console. log (password);
        const user = await User. findAll({ where : { email }}). then (user => {
        if (user.length > 0){
            if (user[0].password === password){
                res.status (200). json ({success: true, message: "User logged in[successfully"})
            } else{
                return res.status(400).json ({success: false, message: "Password is incorrect"})
            }
        } 
        else{
        return res. status (404) . json ({success: false, message: 'User Doesnot exitst'})
        }
        })
        .catch(err => {
            res.status(400).json({success: false, message: err})
        })
})

sequelize.sync()
.then( () => {
    app.listen(1000);
})
.catch( err => console.log(err));