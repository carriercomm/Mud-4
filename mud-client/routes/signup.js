var recaptcha = require('express-recaptcha');
recaptcha.init('6LfVJgUTAAAAAJg3RnIq5TwoFqVE11gbFO_QSDO4', '6LfVJgUTAAAAAKOMazg4kYFNSkm9lVdEyBFhvuNE');

module.exports = function (app, passport) {
  app.use(function(req, res, next) {
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

  app.get('/signup', isLoggedIn, function(req, res) {
    res.render('signup', {
      message: req.flash('signupMessage'),
      data: {}
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  function validateData(data) {
    var error = "";

    if (!validateEmail(data.email)) {
      error = "Invalid e-mail address";
    }

    if (data.username == "" || data.password == "" || data.email == "") {
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
};
