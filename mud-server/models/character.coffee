mongoose = require 'mongoose'
Schema = mongoose.Schema;

charSchema = new Schema {
  charClass: String,
  name: String,
  gender: String,
  race: String,
  user: String
}

module.exports = mongoose.model 'Character', charSchema
