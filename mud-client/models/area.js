var mongoose = require('mongoose')
var Schema = mongoose.Schema
var autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose.connection)

var roomSchema = new Schema({
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

roomSchema.plugin(autoIncrement.plugin, {
  model: 'Room',
  startAt: 1
})
module.exports = mongoose.model('Room', roomSchema)
module.exports = mongoose.model('Area', areaSchema)
