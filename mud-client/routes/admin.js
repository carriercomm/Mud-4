var express = require('express')
var router = express.Router()

router.use(isAdmin)

router.get('/', function(req, res) {
  res.render('admin', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group == 'admins'
  })
})

.get('/areas', function(req, res) {
  res.render('admin/area', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group == 'admins'
  })
})

.get('/users', function(req, res) {
  res.render('admin/user', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group == 'admins'
  })
})

.route('/newarea')
.get(function(req, res) {
  res.render('admin/newarea', {
    isLoggedIn: req.isAuthenticated(),
    isAdmin: req.user.group == 'admins'
  })
})
.post(function(req, res) {
  console.log(req.body)
  res.redirect('/admin/areas')
})

function isAdmin(req, res, next) {
  if (req.user.group == 'admins') {
    next()
  } else {
    res.redirect('/')
  }
}

module.exports = router
