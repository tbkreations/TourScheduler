const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const nodemailer = require("nodemailer");
const passport = require("passport");
const fs = require('fs');
const User = require('./models/user.js')

const app = express();

//Passpport Config
require("./config/passport.js")(passport);

//DB Config
let db;
if (fs.existsSync(__dirname + '/config')) {
    console.log("Mongo Setup: DBCONF");
    db = require('./config/keys').MongoURI;
} else {
    console.log("Mongo Setup: DBENV");
    db = process.env.DATABASE_URL;
};

//Connect to Mongo
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("MongoDB Connected...");
        //Create Admin Account on Startup
        User.deleteMany({
            email: 'trae0714@gmail.com'
        }, function (err) {});

        console.log(process.env.ADMIN_PASS)
        const Admin = new User({
            firstname: 'Trae',
            lastname: 'Brown',
            email: 'trae0714@gmail.com',
            password: process.env.ADMIN_PASS,
            roles: ['Admin'],
            verified: true
        })
        console.log(Admin.firstname + ' ' + Admin.roles + ' Created')
        Admin.save();
    })
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(__dirname + "/public"));

//Body Parser
app.use(express.urlencoded({
    extended: false
}));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

//Globals
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/tours', require('./routes/tours.js'));

//Nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.tutours@gmail.com',
        pass: 'TYouKn0W'
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server Started on Port ${PORT}...`));