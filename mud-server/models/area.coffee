mongoose = require 'mongoose'
Schema = mongoose.Schema

exitSchema = new Schema
  _id: false
  to: String
  direction: String

roomSchema = new Schema
  title: String
  description: String
  floor: Number
  coordinates: String
  exits: [exitSchema]
  characters: Array

areaSchema = new Schema
  name: String
  description: String
  rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}]

module.exports = mongoose.model 'Exit', exitSchema
module.exports = mongoose.model 'Room', roomSchema
module.exports = mongoose.model 'Area', areaSchema
