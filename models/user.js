const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('Users',{
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ispremiumuser: Sequelize.BOOLEAN, 
  totalexpenses:{
    type:Sequelize.INTEGER,
    defaultValue:0
}
});

module.exports = User;