var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router
  .get('/', function(req, res) {
    res.render('signup');
  })

  .post('/', function(req, res) {
    var user = new User();

    user.username = req.body.username ? req.body.username : "";
    user.email = req.body.email ? req.body.email : "";

    user.save(function(err) {
      if (err) throw err;

      res.json("User added successfully");
    });
  });

module.exports = router;
