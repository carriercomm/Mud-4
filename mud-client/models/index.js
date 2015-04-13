var mongoose = require('mongoose');
var config = require('../config/database');

mongoose.connect(config.url);

exports.User = require('./user');
