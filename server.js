const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const app = express()

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log("MongoDB Connected..."));
    // .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

//Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/tours', require('./routes/tours.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server Started on Port ${PORT}...`));
