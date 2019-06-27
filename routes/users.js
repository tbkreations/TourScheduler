const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User Model
const User = require('../models/user.js');

//Login Page
router.get('/login', (req, res) => res.render("login"));

//Register Page
router.get('/register', (req, res) => res.render("register"));

//Register Handle
router.post('/register', (req, res) => {
    const {
        first_name,
        last_name,
        email,
        password,
        confirmPassword
    } = req.body;
    let errors = []

    //Check required fields
    if (!first_name || !last_name || !email || !password || !confirmPassword) {
        errors.push({
            msg: "Please Fill In All Fields"
        });
    }

    //Check passwords match
    if (password != confirmPassword) {
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
            first_name,
            last_name,
            email,
            password,
            confirmPassword
        })
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                //User Exists
                errors.push({ msg: "E-Mail is already registered"})
                res.render('register', {
                    errors,
                    first_name,
                    last_name,
                    email,
                    password,
                    confirmPassword
                });
            } else {
                const newUser = new User({
                    firstname: first_name,
                    lastname: last_name,
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
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        });
    }
})

//Login Handle
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logout Success');
    res.redirect('/login');
})

module.exports = router;