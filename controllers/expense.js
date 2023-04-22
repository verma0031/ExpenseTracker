const Expense = require('../models/expense');

exports.addExpense = async(req, res, next) => {
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
}

exports.getExpense = async (reg, res, next) => {
    const expense = await Expense .findAll();
    res.status (200) . json ({allUsers: expense} )
}

exports.deleteExpense = async (req, res, next) => { 
    const uId = req.params. id;
    await Expense. destroy({where: {id: uId}});
    res.sendStatus (200);
}