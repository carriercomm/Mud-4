mongoose = require 'mongoose'
Room = mongoose.model 'Room'
Schema = mongoose.Schema

areaSchema = new Schema
  _id: String
  name: String
  description: String
  rooms: [Room]

module.exports = mongoose.model 'Area', areaSchema
