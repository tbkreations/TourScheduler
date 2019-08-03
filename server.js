const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const nodemailer = require("nodemailer");
const passport = require("passport");
const bcrypt = require('bcryptjs');
const fs = require('fs');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const User = require('./models/user.js');
const Tour = require('./models/tour.js');

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

        const Admin = new User({
            firstname: 'Trae',
            lastname: 'Brown',
            email: 'trae0714@gmail.com',
            password: require('./config/keys').ADMIN_PASS,
            roles: ['Admin'],
            verified: true
        })

        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(Admin.password, salt, (err, hash) => {
            if (err) throw err;
            //Set password to Hashed
            Admin.password = hash;
            //Save User
            Admin.save()
                .catch(err => console.log(err));
        }))

        console.log(Admin.firstname + ' ' + Admin.lastname + ' ' + Admin.roles + ' Created')
    })
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
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

app.use(methodOverride('_method'));


//Data Man.

app.delete("/dashboard/:id", function (req, res) {
    console.log("dashboard delete");
    User.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/dashboard");
            req.flash('error_msg', 'Delete Failed');
        } else {
            req.flash('success_msg', 'Delete Success');
            res.redirect("/dashboard");
            console.log('User Deleted: ' + req.params.id);
        }
    });
});

app.delete("/tourList/:id", async function (req, res) {
    console.log("tour delete");
    console.log(req.params.id);
    const acceptedTours = await [Tour.findById(req.params.id)];
    const result = await Promise.all(acceptedTours)
    console.log(result);

    try {
        User.findByIdAndUpdate(req.user._id, {
            tours: acceptedTours
        }, (err) => {
            if (err) {
                console.log('User List NOT Updated');
                req.flash('error_msg', 'Query Error: Could Not Update List')
            } else {
                Tour.findOneAndDelete(req.params.id, function (err) {
                    if (err) {
                        console.log('Delete Error: Master List Not Updated')
                    } else {
                        console.log('Success: Master List Updated...');
                        console.log('Lists Updated!');
                        res.redirect('/profile')
                    }
                })
            }
        })
    } catch (e) {
        console.log(e);
    }
    
    
    // Tour.findById(req.params.id, function (err) {
    //     if (err) {
    //         req.flash('error_msg', 'Tour Accept Error');
    //         res.redirect('/tourList');
    //         console.log('Tour Accept Error');
    //     } else {
    //         req.flash('success_msg', 'Tour Accepted');
    //         console.log(req.user.firstname + ': ' + req.user._id);
    //         console.log('Tour Accept Success');

    //         User.findByIdAndUpdate(req.user._id, {
    //             tours: acceptedTours
    //         }, (err) => {
    //             if (err) {
    //                 console.log('User List NOT Updated')
    //             } else {
    //                 console.log('User Updated')
    //             }
    //         })

    //         res.redirect('/profile');
    //     }
    // })
})



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