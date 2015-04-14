var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('account');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    next();

  res.redirect('/');
}

module.exports = router;
