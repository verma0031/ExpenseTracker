const Expense = require('../models/expense');
const sequelize = require('../util/database')
const User = require('../models/user');
const AWS=require('aws-sdk');
const { response } = require('express');
require('dotenv').config()

const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');

exports.addExpense = async(req, res, next) => {
    const t = await sequelize.transaction();
    try{
        const expense = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;
    
        console.log(expense , description , category);
    
        console.log("post request");
    
        const data = await Expense.create( {
            expense: expense,
            description: description,
            category: category,
            UserId:req.user.id
        }, {transaction:t})
        const totalExpense = Number(req.user.totalexpenses)+ Number(expense);

        User.update({
            totalexpenses: totalExpense
        },{where: {id: req.user.id}, transaction: t})
        .then(async () => {
            await t.commit();
            res.status(201).json({newUserDetail : data});
        })
        .catch(async(err) => {
            await t.rollback();
            return res.status(500).json({success: false, error: err})
        })

        
        }
        catch(err){
            console.log(err);
            t.rollback();
            return res.status(500).json({
                error: err
            })
        };
}

exports.getExpense = async (req, res, next) => {

    console.log("getting expense",req.user.id);

    Expense.findAll({ where : { UserId: req.user.id}}).then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({ error: err, success: false})
    })
}

exports.deleteExpense = async (req, res, next) => { 

    const t = await sequelize.transaction();
    const uId = req.params. id;
    const expenseRow = await Expense.findOne({where: {id: uId, UserId: req.user.id}, transaction: t})
    const expense = expenseRow.expense;
    const totalExpense = Number(req.user.totalexpenses)- Number(expense);

   Expense. destroy({where: {id: uId, UserId: req.user.id}, transaction: t})


        User.update({
            totalexpenses: totalExpense
        },{where: {id: req.user.id}, transaction: t})
        .then(async () => {
            t.commit();
            return res.status(200).json({ success: true, message: "Deleted Successfuly"});
        })

}

function uploadToS3(data, filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    console.log(BUCKET_NAME);
    const IAM_USER_ID = process.env.IAM_USER_ID;
    console.log(IAM_USER_ID);
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    console.log(IAM_USER_SECRET);

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_ID,
        secretAccessKey: IAM_USER_SECRET,
        // Bucket: BUCKET_NAME 
    })

        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL:'public-read'
        }


        return new Promise((resolve,reject)=>[
            s3bucket.upload(params, (err, s3response) => {
                if (err) {
                  console.log('Something went wrong', err);
                  reject(err)
                } else {
                  console.log('Uploaded successfully', s3response);
                  resolve(s3response.Location)
                }
              })
          ])

        // s3bucket.upload(params, (err, s3response) => {
        //     if(err){
        //         console.log('something went wrong in upload',err);
        //     }
        //     else{
        //         console.log('successfully uploaded',s3response);
        //         return s3response.location;
        //     }
        // })

}

exports.downloadexpense = async(req, res, next) => {

    try{
    console.log("\nin download expenses\n", req.user);
    const expenses = await req.user.getExpenses();
    console.log(expenses);

    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;

    const filename = `Expense${userId}/${new Date()}.txt`;
    
    const fileURL = await uploadToS3(stringifiedExpenses, filename);

    res.status(200).json({fileURL, success: true})
    }catch(err){
        console.log(err);
        res.status(500).json({fileURL:'', success: false, err: err})
    }
}