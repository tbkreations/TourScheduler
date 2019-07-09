const express = require('express');
const router = express.Router();

// Tour Model
const Tour = require("../models/tour.js")

router.get('/reqTour', (req, res) => res.render("reqTour"));

router.get('/success', (req, res) => { 
    // Find tour by id, pass in url
    // tour.findone or findbyid
    
    // Tour.find({}).sort({date: 1}).exec((err, tours) => {
    //     if (err) throw err

    //     res.render('success', {
    //         name: req.tour.reqFirstName + " " + req.tour.reqLastName,
    //         date: req.tour.date,
    //         time: req.tour.time
    //     })
    // })
})

router.post('/reqTour', (req, res) => {
    const {
        reqFirstName,
        reqLastName,
        email,
        phone,
        date,
        time,
        groupClass,
        groupSize,
        tourType
    } = req.body;
    console.log(req.body);
    let errors = [];

    if (!reqFirstName || !reqLastName || !email || !phone || !date || !time || !groupClass || !groupSize || !tourType) {
        errors.push({
            msg: "Please Fill in All Fields"
        });
    } 
    
    if (errors.length > 0) {
        res.render('reqTour', {
            errors,
            reqFirstName,
            reqLastName,
            email,
            phone,
            date,
            time,
            groupClass,
            groupSize
        })
    } else {
        newTourReq = new Tour({
            reqFirstName,
            reqLastName,
            email,
            phone,
            date,
            time,
            groupClass,
            groupSize,
            tourType
        });

        //Save Tour
        newTourReq.save()
        .then(tour => {
            req.flash('success_msg', 'Your Tour Request Has Been Submitted');
            res.redirect('/tours/reqTour');
        })
        .catch(err => console.log(err));
    }
})

module.exports = router;