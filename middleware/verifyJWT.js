const jwt = require('jsonwebtoken');
const User = require('../data/userList.json')
require('dotenv').config();


const verfiyToken = (req, res, next) => {
    if(req.headers && req.headers.authorization){
        // const token = req.headers.authorization.split("Bearer ")[1];

        const token = req.headers.authorization;

        jwt.verify(token, process.env.API_SECRET, (err,decode)=>{
            if(err){
                req.user = undefined;
                req.message = "Header verification failed. Not Authorized ";
                next();
            }else{
                let _id = User.Users.find((user)=> user.id == decode.id)

                if(_id){
                    req.user = _id;
                    req.message = "Verification successful";
                    next();
                }else{
                    req.user = undefined;
                    message="Something went wrong";
                    next();
                }
            }
        })
    }else{
        req.user = undefined;
        req.message = "Authorization header not found";
        next();
    }
}

module.exports = verfiyToken;