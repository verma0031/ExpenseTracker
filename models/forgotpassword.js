const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//id, name , password, phone number, role

exports.Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})