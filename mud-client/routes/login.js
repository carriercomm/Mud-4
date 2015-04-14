var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);

router
.get('/', function(req, res) {
  res.render('login');
})

.post('/', function(req, res, next) {
  passport.authenticate('local-login', function(err, user) {
    if (err) throw err;

    if (!user) {
      res.render('login', {
        error: true,
        errorMessage: req.flash('loginMessage')
      });
    } else {
      res.redirect('account');
    }
  })(req, res, next);
});

module.exports = router;
