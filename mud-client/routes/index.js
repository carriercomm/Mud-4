var login = require('./login');
var signup = require('./signup');
var profile = require('./profile');

module.exports = function(app, passport) {

  app.get('/', ensureAuthentication, function(req, res) {
    res.render('index',{
      isLoggedIn: req.isAuthenticated()
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/play', ensureAuthentication, function(req, res) {
    res.render('mud');
  });

  login(app, passport);
  signup(app, passport);
  profile(app);

  function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.render('login');
    }
  }
};
