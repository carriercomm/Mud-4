var express = require('express')
var router = express.Router()

// router.use(ensureAuthentication)

router.get('/', function(req, res, next) {
  res.render('index', {
    isLoggedIn: req.isAuthenticated()
  })
})
.get('/play', function(req, res) {
  if (req.session && req.session.passport) {
    res.render('mud')
  }
})
.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.render('login')
  }
}

module.exports = router
