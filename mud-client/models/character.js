var mongoose = require('mongoose')
var Schema = mongoose.Schema

var charSchema = new Schema({
  charClass: String,
  name: String,
  gender: String,
  race: String,
  user: String,
  level: Number,
  experience: Number,
  nextLevel: Number,
  life: Number,
  energy: Number
})

module.exports = mongoose.model('Character', charSchema)
