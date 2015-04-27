var express = require('express')
var router = express.Router()
var passport = require('passport')
var recaptcha = require('express-recaptcha')
recaptcha.init('6LfVJgUTAAAAAJg3RnIq5TwoFqVE11gbFO_QSDO4', '6LfVJgUTAAAAAKOMazg4kYFNSkm9lVdEyBFhvuNE')

router.use(function (req, res, next) {
  if (req.method === 'POST') {
    recaptcha.verify(req, function (success, error) {
      if (error) {
        res.render('signup', {
          error: true,
          errorMessage: 'Are you a robot?',
          data: req.body
        })
      } else {
        var errorMessage = validateData(req.body)

        if (errorMessage !== '') {
          res.render('signup', {
            error: true,
            errorMessage: errorMessage,
            data: req.body
          })
        } else {
          next()
        }
      }
    })
  } else {
    next()
  }
})

router.get('/', isLoggedIn, function (req, res) {
  res.render('signup', {
    message: req.flash('signupMessage'),
    data: {}
  })
})
.post('/', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}))

function validateData (data) {
  var error = ''

  if (!validateEmail(data.email)) {
    error = 'Invalid e-mail address'
  }

  if (data.username === '' || data.password === '' || data.email === '') {
    error = 'All fields are mandatory'
  }

  return error
}

function validateEmail (email) {
  var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  return regex.test(email)
}

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }

  next()
}

module.exports = router
