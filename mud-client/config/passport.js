var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      passReqToCallback : true
    }, function(req, username, password, done) {
      process.nextTick(function() {
        User.findById(username, function(err, user) {
          if (err) return done(err);

          if (user) {
            return done(null, null, req.flash('signupMessage', 'That username is already taken.'));
          } else {
            var newUser = new User();
            newUser._id = username;
            newUser.local.email = req.body.email;
            newUser.local.password = newUser.generateHash(password);

            newUser.save(function(err) {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      });
  }));

  passport.use('local-login', new LocalStrategy({
    passReqToCallback : true
  }, function(req, username, password, done) {
    User.findById(username, function(err, user) {
      if (err)
        return done(err);

      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found with username: ' + username));

      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      
      return done(null, user);
    });
  }));
}
