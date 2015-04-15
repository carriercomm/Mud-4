module.exports = function(app, passport) {

  app.get('/login', isLoggedIn, function(req, res) {
    res.render('login', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }));

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      res.redirect('/');

    next();
  }
}
