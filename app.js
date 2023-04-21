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

app. get ('/user/get-user' , async (reg, res, next) => {

    console.log("inside get all user");

    try{
    const users =await User.findAll({where:{email:email}})

    if(users.length>0)
    {
        bcrypt.compare(password,users[0].password,(err,result)=>{
        if(err)
        {
            console.log("error occured");
            return result.status(500).json({message:'something went wrong'})
        }
        if(result===true)
        {
            return res.status(201).json({message:'user logged in'})
        }
        else{
           return res.status(401).json({message:'password incorrect'})
             
        }
        })
        
    }
    else{
        return res.status(404).json({message:'user not found'})
    }

}
catch(err){
    return res.status(500).json({message:err})
}
});

sequelize.sync()
.then( () => {
    app.listen(1000);
})
.catch( err => console.log(err));