const express = require('express');

const expenseController = require('../controllers/expense');

// const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addExpense', expenseController.addExpense);

router.get('/getExpense', expenseController.getExpense);

router.delete('/delete-expense/:id', expenseController.deleteExpense);

module.exports = router;