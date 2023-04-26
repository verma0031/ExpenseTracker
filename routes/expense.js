const express = require('express');

const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth')

// const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addExpense', userAuthentication.authenticate, expenseController.addExpense);

router.get('/getExpense', userAuthentication.authenticate, expenseController.getExpense);

router.delete('/delete-expense/:id',userAuthentication.authenticate, expenseController.deleteExpense);

router.get('/download', userAuthentication.authenticate, expenseController.downloadExpenses)

module.exports = router;