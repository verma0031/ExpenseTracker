const Expense = require('../models/expense');
const sequelize = require('../util/database')
const User = require('../models/user');

exports.addExpense = async(req, res, next) => {
    try{
        const t = await sequelize.transaction();
        const expense = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;
    
        console.log(expense , description , category);
    
        console.log("post request");
    
        const data = await Expense.create( {
            expense: expense,
            description: description,
            category: category,
            UserId:req.user.id
        }, {transaction:t})
        const totalExpense = Number(req.user.totalexpenses)+ Number(expense);

        User.update({
            totalexpenses: totalExpense
        },{where: {id: req.user.id}, transaction: t})
        .then(async () => {
            await t.commit();
            res.status(201).json({newUserDetail : data});
        })
        .catch(async(err) => {
            await t.rollback();
            return res.status(500).json({success: false, error: err})
        })

        
        }
        catch(err){
            console.log(err);
            t.rollback();
            return res.status(500).json({
                error: err
            })
        };
}

exports.getExpense = async (req, res, next) => {

    console.log("getting expense",req.user.id);

    Expense.findAll({ where : { UserId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}

exports.deleteExpense = async (req, res, next) => { 
    const uId = req.params. id;
    await Expense. destroy({where: {id: uId, UserId: req.user.id}});
    res.sendStatus (200);
}