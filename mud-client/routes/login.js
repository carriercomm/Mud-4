var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);

router
.get('/', function(req, res) {
  res.render('signin');
})

.post('/', function(req, res, next) {
  passport.authenticate('local-signin', function(err, user) {
    if (err) throw err;

    if (!user) {
      res.render('signin', {
        error: true,
        errorMessage: req.flash('signinMessage')
      });
    } else {
      res.render('account', user);
    }
  });
});

module.exports = router;
