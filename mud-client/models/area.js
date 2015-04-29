var mongoose = require('mongoose')
var Schema = mongoose.Schema

var exitSchema = new Schema({
  _id: false,
  from: String,
  to: String,
  direction: String
})

var roomSchema = new Schema({
  title: String,
  description: String,
  floor: Number,
  exits: [exitSchema]
})

var areaSchema = new Schema({
  _id: String,
  name: String,
  description: String,
  rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}]
})

module.exports = mongoose.model('Exit', exitSchema)
module.exports = mongoose.model('Room', roomSchema)
module.exports = mongoose.model('Area', areaSchema)
