const fs =require('fs');
const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const routes = express.Router();
require('dotenv').config();

routes.use(express.json());
routes.use(express.urlencoded({extended:true}));

const loginModel = require('../Models/login');
const User = require('../data/userList.json')

routes.post('/', async (req,res)=>{
    try{
        let userCredlogin = req.body;

        isEmailExist = User.Users.findIndex((user)=> user.email == userCredlogin.email)

        if(isEmailExist == -1){
            res.status(401).json({
                status:"Failed",
                message:"User does not exist"
            })
        } else {
            isPasswordValid = bcrypt.compareSync(userCredlogin.password, User.Users[isEmailExist].password);
            if(!isPasswordValid){
                res.status(401).json({
                    status:"Failed",
                    message:"Invalid password, Please try again!"
                })
            }else{
                let token = jwt.sign({
                    id:User.Users[isEmailExist].id
                }, process.env.API_SECRET,{
                    expiresIn:86400
                })


                res.status(200).json({
                    status:"Success",
                    User:{
                        id:User.Users[isEmailExist].id
                    },
                    message:"Login Successful",
                    token: token
                })
            }
        }
    }catch(err){
        res.status(400).json({
            status:"Failed",
            message:err.message
        })
    }
})


module.exports = routes