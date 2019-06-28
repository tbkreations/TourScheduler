const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/auth');

const User = require('../models/user.js')

//Home Page
router.get('/', (req, res) => res.render("welcome"));

//Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    User.find({}).exec((err, users) => {
        if (err) throw err
        
        res.render("dashboard", {
            name: req.user.firstname + " " + req.user.lastname,
            "users": users,
            verified: req.user.verified
        })
    })
});

router.get('/verify', ensureAuthenticated, (req, res) => {
    if (err) throw err
    res.render("verify")
});

module.exports = router;