const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');

const User      = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length > 0){
            return res.status(409).json({
                message: "Mail exists"
            })
        } else {

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    });
        
                    user.save()
                    .then(result =>{
                        return res.status(200).json({
                            message: 'User Created',
                        });
                    })
                    .catch(err => {
                        res.status(500).json(err)
                    });
                }
            })
        }
    })
})

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(users => {
        if(users.length < 1){
            return res.status(401).json({
                message: "Auth Failed"
            })
        }

        bcrypt.compare(req.body.password,users,users[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: "Auth Failed"
                })
            }

            if(result){
                const token = jwt.sign({
                    email: users[0].email,
                    user_id: users[0]._id
                },process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                })
                return res.status(200).json({
                    message: "Auth success",
                    token: token
                })
            }

            res.status(401).json({
                message: "Auth Failed"
            })
        })
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.delete("/:userId", (req, res, next) => {
    User.remove({_id: req.param.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Deleted successfully"
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports  = router;