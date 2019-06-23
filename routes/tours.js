const express = require('express');
const router = express.Router();

router.get('/reqTour', (req, res) => res.render("reqTour"));

module.exports = router;