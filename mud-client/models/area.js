var mongoose = require('mongoose')
var Room = mongoose.model('Room')
var Schema = mongoose.Schema

var areaSchema = new Schema({
  _id: String,
  name: String,
  description: String,
  rooms: [Room]
})

module.exports = mongoose.model('Area', areaSchema)
