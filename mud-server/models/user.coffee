mongoose = require 'mongoose'
Schema = mongoose.Schema

userSchema = new Schema
  _id: String
  group: String
  local:
    email: String
    password: String

module.exports = mongoose.model 'User', userSchema
