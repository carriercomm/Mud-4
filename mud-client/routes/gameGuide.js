var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('gameGuide', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.isAuthenticated() ? req.user.group === 'admins' : null,
    user: req.user
  })
})

module.exports = router
