const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
require('dotenv').config()


const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

exports.forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        console.log("\ninside forgot pass\n", user);
        if(user){
            const id = uuid.v4();
            console.log(id);
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

            sgMail.setApiKey('process.env.SENDGRID_API_KEY')

            const msg = {
                to: email, // Change to your recipient
                from: process.env.SG_MAIL, // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:1000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

                console.log(response[0].statusCode)
                console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                console.log(err);
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    console.log(id);
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

exports.updatepassword = (req, res) => {

    try {
        // console.log("\nupdating password\n", req.params);
        // console.log("\nupdating password\n", req.query);
        const newpassword  = req.query.newpassword;
        const id  = req.params.resetpasswordid;
        // console.log("\nupdating password\n", id);
        Forgotpassword.findOne({ where : { id: id }}).then(resetpasswordrequest => {
            // console.log("\nupdate pass\n",resetpasswordrequest);
            // console.log("\nupdate pass\n",resetpasswordrequest.UserId);

            User.findOne({where: { id : resetpasswordrequest.UserId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password
                    console.log("user found and dettails are",user);

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){

                            console.log("Err in generating salt",err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log("Error in hasing",err);
                                throw new Error(err);
                            }
                            User.update({ password: hash }).then(() => {
                                console.log("updated successfully");
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        console.log("\nin catch block\n",error);
        return res.status(403).json({ error, success: false } )
    }

}