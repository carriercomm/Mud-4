module.exports = function(app, passport) {

  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post('/login', isLoggedIn, function(req, res, next) {
    passport.authenticate('local-login', function(err, user) {
      if (err) throw err;

      if (!user) {
        res.render('login', {
          error: true,
          errorMessage: req.flash('loginMessage')
        });
      } else {
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/profile');
        });
      }
    })(req, res, next);
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      res.redirect('/');

    next();
  }
}