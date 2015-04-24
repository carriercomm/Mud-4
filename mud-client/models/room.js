var mongoose = require('mongoose')
var Schema = mongoose.Schema

var roomSchema = new Schema({
  _id: String,
  description: String,
  exits: Object
})

module.exports = mongoose.model('Room', roomSchema)
