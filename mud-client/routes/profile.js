var mongoose = require('mongoose');
var User = mongoose.model('User');
var Character = mongoose.model('Character');

module.exports = function(app) {
  app.get('/profile', ensureAuthentication, function(req, res) {
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
      if (user) {
        Character.find({user: user._id}, function(err, characters) {
          res.render('profile', {
            user: user,
            isLoggedIn: req.isAuthenticated(),
            message: req.flash('newChar'),
            characters: characters
          });
        });
      }
    });
  });

  app.get('/profile/:id/newchar', ensureAuthentication, function(req, res) {
    res.render('newchar', {
      isLoggedIn: req.isAuthenticated()
    });
  });

  function ensureAuthentication (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.render('login');
    }
  }
};
