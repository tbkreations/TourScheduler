const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const nodemailer = require("nodemailer");
const passport = require("passport");
const fs = require('fs');

const app = express();

//Passpport Config
require("./config/passport.js")(passport);

//DB Config
let db;
if (fs.existsSync(__dirname + '/config')) {
    console.log("DBCONF");
    db = require('./config/keys').MongoURI;
}
else {
    console.log("DBENV");
    db = process.env.DATABASE_URL;
}

console.log(db);

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log("MongoDB Connected..."));
    // .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

//Body Parser
app.use(express.urlencoded({extended: false}));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server Started on Port ${PORT}...`));
