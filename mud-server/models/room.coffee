mongoose = require 'mongoose'
Schema = mongoose.Schema

roomSchema = new Schema
  _id: String
  description: String
  exits: Object

module.exports = mongoose.model 'Room', roomSchema
