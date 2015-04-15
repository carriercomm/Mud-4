var login = require('./login');
var signup = require('./signup');
var mud = require('./mud');
var profile = require('./profile');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index',{
      isLoggedIn: req.isAuthenticated()
    }); 
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  login(app, passport);
  signup(app, passport);
  mud(app);
  profile(app);
};