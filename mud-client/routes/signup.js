var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.use(function(req, res, next) {
  if (req.method === "POST") {
    var error = validateData(req.body);
    if (error !== "") {
      res.render('signup', {
        error: true,
        errorMessage: error
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

router
  .get('/', function(req, res) {
    res.render('signup');
  })

  .post('/', function(req, res) {
    var user = new User();
    user._id = req.body.username ? req.body.username : "";
    user.email = req.body.email ? req.body.email : "";

    User.findById(req.body.username, function(err, data) {
      if (err) return next(err);

      if (data) {
        res.render('signup', {
          error: true,
          errorMessage: 'User already registered with this username'
        });
      } else {
        user.save(function(err) {
          if (err) throw err;

          res.render('account');
        });
      }
    });
  });

function validateData(data) {
  var error = "";

  if (!validateEmail(data.email)) {
    error = "Invalid e-mail address";
  }

  if (!validatePasswords(data.password, data.retypepassword)) {
    error = "Passwords do not match";
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

module.exports = router;
