const express = require('express');

const expenseController = require('../controllers/expense');

// const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addExpense', expenseController.addExpense);

module.exports = router;