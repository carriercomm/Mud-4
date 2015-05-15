mongoose = require 'mongoose'
Schema = mongoose.Schema

charSchema = new Schema
  charClass: String
  name: String
  gender: String
  race: String
  user: String
  level: Number
  experience: Number
  nextLevel: Number
  life: Number
  energy: Number
  area: String
  room: String

module.exports = mongoose.model 'Character', charSchema
