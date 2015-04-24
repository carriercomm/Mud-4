module.exports = function(app) {
  app.get('/admin', isAdmin, function(req, res) {
    res.render('admin', {
      isLoggedIn: req.isAuthenticated(),
      isAdmin: req.user.group == 'admins'
    })
  })

  app.get('/admin/areas', isAdmin, function(req, res) {
    res.render('admin/area', {
      isLoggedIn: req.isAuthenticated(),
      isAdmin: req.user.group == 'admins'
    })
  })

  app.get('/admin/users', isAdmin, function(req, res) {
    res.render('admin/user', {
      isLoggedIn: req.isAuthenticated(),
      isAdmin: req.user.group == 'admins'
    })
  })

  app.get('/admin/newarea', isAdmin, function(req, res) {
    res.render('admin/newarea', {
      isLoggedIn: req.isAuthenticated(),
      isAdmin: req.user.group == 'admins'
    })
  })

  function isAdmin(req, res, next) {
    if (req.user.group == 'admins') {
      next()
    } else {
      res.redirect('/')
    }
  }
}