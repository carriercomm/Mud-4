var express = require('express')
var router = express.Router()

router.get('/', ensureAuthentication, function (req, res, next) {
  res.render('index', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group === 'admins',
    user: req.user
  })
})
.get('/play', function (req, res) {
  if (req.session && req.session.passport) {
    res.render('mud', {
      user: req.user._id
    })
  }
})
.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

function ensureAuthentication (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.render('login')
  }
}

module.exports = router
