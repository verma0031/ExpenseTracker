const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, 'dsghJWarYXGjhgrDaICnGZHjGw9yDcre');
        console.log('userID >>>> ', user.userId)
        User.findByPk(user.userId).then(user => {

            req.user = user; ///ver
            next();
        })

    }
     catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
        // err
    }
}