module.exports = function(app) {

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      isLoggedIn: req.isAuthenticated()
    });
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      next();

    res.redirect('/');
  }
}
