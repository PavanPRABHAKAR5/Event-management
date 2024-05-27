const fs = require('fs');
const express = require('express');
const routes = express.Router()
const bcrypt = require('bcrypt');
const { randomBytes } = require('crypto'); // To generate new ID
// const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
require('dotenv').config()

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

const registerModel = require('../Models/register')
const User = require('../data/userList.json')

// sgMail.setApiKey(process.env.API_EMAIL);




routes.post('/', async (req, res) => {
    try {
        let userCred = req.body;
        let isEmailExist = User.Users.find((user) => user.email == userCred.email)
        if (isEmailExist) {
            return res.status(400).json({
                Status: "Failed",
                message: "User already exist"
            })
        }
        let userList = User
        let isUserRegistered = registerModel(userCred)
        if (isUserRegistered.status == true) {
            userCred.password = bcrypt.hashSync(userCred.password, 8)
            userCred.id = randomBytes(4).toString('hex') // randomBytes function from the Node.js crypto module to generate a random sequence of bytes and then converting it to a hexadecimal string using toString('hex').
            userList.Users.push(userCred)
            

            fs.writeFile('./data/userList.json', JSON.stringify(userList), { encoding: 'utf8', flag: 'w' }, (err, data) => {
                if (err) {
                    res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                } else {

                    res.status(200).json({
                        status: "Success",
                        message: isUserRegistered.message
                    });
                }
            });

        } else {
            res.status(400).json({
                status: "Failed",
                message: isUserRegistered.message
            })
        }

    } catch (err) {
        res.status(400).json({
            status: "Failed",
            message: err.message
        })
    }
})

module.exports = routes;