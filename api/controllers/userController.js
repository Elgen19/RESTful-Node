const mongoose = require('mongoose');
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.user_signup = (req, res, next)=>{
    User.findOne({email: req.body.email})
    .exec()
    .then(user=>{
        if (user){
            return res.status(409).json({
                message: 'Email address already exist!'
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) =>{
                if (err){
                    return res.status(500).json({
                        error: err
                    })
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result=>{
                        console.log(result)
                        res.status(201).json({
                            message: "User created!"
                        })
                    })
                    .catch(err=>{
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    }) 
}

exports.user_login = (req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if (err){
                console.log(err)
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if (result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                },

            )
                console.log(result)
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                })
            }

            res.status(401).json({
                message: 'Auth failed'
            })
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}

exports.user_deletion = (req, res, next)=>{
    const id = req.params.userId;
    User.deleteOne({_id: id})
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message: "User deleted!",
            request :{
                type: 'DELETE'
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
}

exports.get_all_users = (req, res, next)=>{
    User.find()
    .exec()
    .then(result=>{
        res.status(200).json({
            count: result.length,
            message: result
        })
    })
    .catch()
}