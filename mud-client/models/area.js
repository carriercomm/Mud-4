var mongoose = require('mongoose')
var Schema = mongoose.Schema

var roomSchema = new Schema({
  _id: String,
  title: String,
  description: String,
  exits: [String]
})

var areaSchema = new Schema({
  _id: String,
  name: String,
  description: String,
  rooms: [roomSchema]
})

module.exports = mongoose.model('Room', roomSchema)
module.exports = mongoose.model('Area', areaSchema)
