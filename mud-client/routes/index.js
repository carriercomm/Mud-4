var login = require('./login');
var signup = require('./signup');
var mongoose = require('mongoose');
var User = mongoose.model('User')

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

  app.get('/profile', ensureAuthentication, function(req, res, next) {
    if (req.session && req.session.passport) {
      User.findById(req.session.passport.user, function(err, user) {
        res.redirect('/profile/' + user._id);
      });
    } else {
      res.redirect('/');
    }
  });

  app.get('/profile/:id', ensureAuthentication, function(req, res) {
    User.findById(req.params.id, function(err, user) {
      res.render('profile', {
        user: user,
        isLoggedIn: req.isAuthenticated()
      });
    });
  });

  app.get('/play', ensureAuthentication, function(req, res) {
    res.render('mud');
  });

  login(app, passport);
  signup(app, passport);

  function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  }
};