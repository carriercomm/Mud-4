var express = require('express')
var router = express.Router()
var passport = require('passport')

// router.use(isLoggedIn)

router.get('/', function(req, res) {
  res.render('login', {
    message: req.flash('loginMessage')
  })
})
.post('/', passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}))

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/')

  next()
}

module.exports = router
