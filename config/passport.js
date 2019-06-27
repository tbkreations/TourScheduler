const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load User Model
const User = require("../models/user.js");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, (email, password, done) => {
            // Match User
            User.findOne({
                    email: email
                })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: 'Email is Not Registered'
                        });
                    }

                    // Match Password
                    bcrypt.compare(password, user.password, (err, ismMatch) => {
                        if (err) throw err;

                        if (ismMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                message: "Incorrect Password"
                            })
                        }
                    });
                })
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}