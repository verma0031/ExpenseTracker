const express = require('express');

const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth')

// const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addExpense', expenseController.addExpense);

router.get('/getExpense', userAuthentication.authenticate, expenseController.getExpense);

router.delete('/delete-expense/:id', expenseController.deleteExpense);

module.exports = router;