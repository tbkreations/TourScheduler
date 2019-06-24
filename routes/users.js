const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");

//User Model
const User = require('../models/user.js');

//Login Page
router.get('/login', (req, res) => res.render("login"));

//Register Page
router.get('/register', (req, res) => res.render("register"));

//Register Handle
router.post('/register', (req, res) => {
    console.log(req.body);
    res.send("Hello");

    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = []

    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: "Please Fill In All Fields"
        });
    }

    //Check passwords match
    if (password != password2) {
        errors.push({
            msg: "Passwords do not Match"
        });
    }

    //Check pass length
    if (password.length < 6) {
        errors.push({
            msg: "Password Must Be At Least 6 Characters"
        });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                //User Exists
                errors.push({ msg: "E-Mail is already registered"})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                //Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    //Set password to Hashed
                    newUser.password = hash;
                    //Save User
                    newUser.save()
                        .then(user => {
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        });
    }
})

module.exports = router;