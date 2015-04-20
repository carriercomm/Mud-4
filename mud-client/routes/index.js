var login = require('./login');
var signup = require('./signup');
var profile = require('./profile');
var mongoose = require('mongoose');
var Character = mongoose.model('Character');

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

  app.post('/newchar', ensureAuthentication, function(req, res, next) {
    if (!req.body.charGender || !req.body.charRace || !req.body.charClass || !req.body.charName) {
      res.json({error: true, message: 'Error creating character. Missing parameter.'});
    } else {
      if (req.session && req.session.passport) {
        var newChar = new Character();
        newChar.charClass = req.body.charClass;
        newChar.gender = req.body.charGender;
        newChar.race = req.body.charRace;
        newChar.name = req.body.charName;
        newChar.user = req.session.passport.user;

        newChar.save(function(err, data) {
          if (err) {
            res.json({error: true, message: 'Error creating character.'});
          } else {
            req.flash('newChar', '' + data.name + ' created!');
            res.json({error: false, message: 'Character created successfully.'});
          }
        });
      } else {
        res.json({error: false, message: 'Error reading user.'});
      }
    }
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
