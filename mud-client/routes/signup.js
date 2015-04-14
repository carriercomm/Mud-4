var express = require('express');
var passport = require('passport');
var recaptcha = require('express-recaptcha');
var router = express.Router();
require('../config/passport')(passport);

recaptcha.init('6LfVJgUTAAAAAJg3RnIq5TwoFqVE11gbFO_QSDO4', '6LfVJgUTAAAAAKOMazg4kYFNSkm9lVdEyBFhvuNE');

router.use(function(req, res, next) {
  if (req.method === "POST") {
    recaptcha.verify(req, function(success, error) {
      if (error) {
        res.render('signup', {
          error: true,
          errorMessage: 'Are you a robot?',
          data: req.body
        });
      } else {
        var error = validateData(req.body);

        if (error !== "") {
          res.render('signup', {
            error: true,
            errorMessage: error,
            data: req.body
          });
        } else {
          next();
        }
      }
    });
  } else {
    next();
  }
});

router.get('/', isLoggedIn, function(req, res) {
  res.render('signup', {data: {}});
})

.post('/', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (user) {
      res.redirect('account');
    } else {
      res.render('signup', {
        error: true,
        errorMessage: req.flash('signupMessage'),
        data: req.body
      });
    }
  })(req, res, next);
});

function validateData(data) {
  var error = "";

  if (!validatePasswords(data.password, data.retypepassword)) {
    error = "Passwords do not match";
  }

  if (!validateEmail(data.email)) {
    error = "Invalid e-mail address";
  }

  if (data.username == "" || data.password == "" || data.retypepassword == "" || data.email == "") {
    error = "All fields are mandatory";
  }

  return error;
}

function validateEmail(email) {
    var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return regex.test(email);
}

function validatePasswords(pass1, pass2) {
  return pass1 === pass2;
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/');

  next();
}

module.exports = router;
