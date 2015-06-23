var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('index', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.isAuthenticated() ? req.user.group === 'admins' : null,
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
.get('/news', function (req, res) {
  res.render('news', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.isAuthenticated() ? req.user.group === 'admins' : null,
    user: req.user
  })
})

module.exports = router
