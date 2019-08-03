const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/auth');
const bcrypt = require('bcryptjs');

const User = require('../models/user.js');
const Tour = require('../models/tour.js');

//Home Page
router.get('/', (req, res) => res.render("welcome"));

//Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    User.find({}).exec((err, users) => {
        if (err) throw err

        res.render("dashboard", {
            name: req.user.firstname + " " + req.user.lastname,
            "users": users,
            verified: req.user.verified,
            roles: req.user.roles,
            tours: Tour.find({})
        })
    })
});

router.get('/tourList', ensureAuthenticated, (req, res) => {
    User.find({}).sort({date: 1}).exec((err, users) => {
        if (err) throw err
        Tour.find({}).sort({date: 1}).exec((err, tours) => {
            if (err) throw err

            res.render('tourList', {
                name: req.user.firstname + " " + req.user.lastname,
                "users": users,
                verified: req.user.verified,
                roles: req.user.roles,
                "tours": tours
            })
        })
    })
})

router.get('/profile', ensureAuthenticated, (req, res) => {
    User.find({}).exec((err, users) => {
        if (err) throw err

        res.render('profile', {
            name: req.user.firstname + " " + req.user.lastname,
            "users": users,
            verified: req.user.verified,
            roles: req.user.roles,
            tours: Tour.find({})
        })
    })
})

router.post('/profile', ensureAuthenticated, (req, res) => {
    const newUser = new User({
        firstname: "Test",
        lastname: "User",
        email: 'test' + Math.floor(Math.random() * 100) + '@tuskegee.edu',
        password: 'password'
    })

     //Hash Password
     bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        //Set password to Hashed
        newUser.password = hash;
        //Save User
        newUser.save()
            .then(user => {
                req.flash('success_msg', 'Test User Created');
                res.redirect('/profile');
            })
            .catch(err => console.log(err));
    }))
})

router.get('/verify', (req, res) => {
    res.render('verify');
});

router.post('/dashboard/promote/:id', ensureAuthenticated, (req, res) => {
    User.findOneAndUpdate({_id: req.params.id}, {$push: {roles: 'Admin'}}, (err, success) => {
        if (err) {
            res.redirect('/dashboard');
            console.log(err);
        } else {
            res.redirect('/dashboard');
            console.log('User Promoted: ' + req.params.id);
        }
    });
})

module.exports = router;