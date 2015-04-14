var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    isLoggedIn: req.isAuthenticated()
  });
});

module.exports = router;
