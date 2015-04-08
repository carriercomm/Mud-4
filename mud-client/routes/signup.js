var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.use(function(req, res, next) {
  console.log('before any request');

  next();
});

router
  .get('/', function(req, res) {
    res.render('signup');
  })

  .post('/', function(req, res) {
    var user = new User();

    user._id = req.body.username ? req.body.username : "";
    user.email = req.body.email ? req.body.email : "";

    User.findById(req.body.username, function(err, data) {
      if (err) return next(err);

      if (data) {
        res.render('signup', {
          error: true,
          errorMessage: 'User already registered with this username'
        })
      } else {
        user.save(function(err) {
          if (err) throw err;

          res.render('account');
        });
      }
    });
  });

module.exports = router;
