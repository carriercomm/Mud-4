var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mud');

exports.User = require('./user');
