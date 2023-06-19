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

const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({userId: id, name:name, ispremiumuser}, 'secretkey');
}

exports.signup = async (req, res, next)=>{
    try{
    const { name, email, password } = req.body;
    console.log('email', email)
    if(isstringinvalid(name) || isstringinvalid(email || isstringinvalid(password))){
        return res.status(400).json({err: "Bad parameters . Something is missing"})
    }
    const saltrounds = 10;
    bcrypt.hash(req.body.password, saltrounds, async (err, hash) => {
        console.log(err)
        const newUser = new User({
            name,
            email,
            password: hash
        })

        await newUser.save();
        res.status(201).json({message: 'Successfuly create new user'})
    })
    }catch(err) {
            res.status(500).json(err);
        }

}

exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email or password is missing' });
      }
  
      const user = await User.findOne({ email });
  
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
  
        if (isPasswordValid) {
          return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token: generateAccessToken(user.id, user.name, user.ispremiumuser)
          });
        } else {
          return res.status(400).json({ success: false, message: 'Password is incorrect' });
        }
      } else {
        return res.status(404).json({ success: false, message: 'User does not exist' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

exports.generateAccessToken = generateAccessToken;
