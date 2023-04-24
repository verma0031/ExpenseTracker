const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function isstringinvalid(string){
    if(string == undefined ||string.length === 0){
        return true
    } else {
        return false
    }
}

const generateToken = (id) => {
    return jwt.sign({userId: id}, 'dsghJWarYXGjhgrDaICnGZHjGw9yDcre');
}

exports.signup = async (req, res, next)=>{
    try{
    const { name, email, password } = req.body;
    console.log('email', email)
    if(isstringinvalid(name) || isstringinvalid(email || isstringinvalid(password))){
        return res.status(400).json({err: "Bad parameters . Something is missing"})
    }
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
        console.log(err)
        await User.create({ name, email, password: hash })
        res.status(201).json({message: 'Successfuly create new user'})
    })
    }catch(err) {
            res.status(500).json(err);
        }

}

exports.login = async (req, res, next) => {
    try{
    const { email, password } = req.body;
    if(isstringinvalid(email) || isstringinvalid(password)){
        return res.status(400).json({message: 'EMail idor password is missing ', success: false})
    }
    console.log(password);
    const user  = await User.findAll({ where : { email }})
        if(user.length > 0){
            bcrypt.compare(password, user[0].password , (err, result) => {
                if(err){
                    res.status(500).json({success: false, message: "Something went wrong"});
                }
                if(result == true){
                    res.status(200).json({success: true, message: "User logged in successfully", token: generateToken(user[0].id)});
                }
                else{
                    return res.status(400).json({success: false, message: 'Password is incorrect'})
                }
            })
        } else {
            return res.status(404).json({success: false, message: 'User Doesnot exitst'})
        }
    }catch(err){
        res.status(500).json({message: err, success: false})
    }
}

exports.generateToken = generateToken;
