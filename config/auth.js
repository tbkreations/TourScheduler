module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'You Must Login To View this Resource');
        res.redirect('/users/login');
    }
}