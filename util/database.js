const Sequelize = require('sequelize');

const sequelize = new Sequelize('Expense', 'root', 'Peeyush#5979', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;