mongoose = require 'mongoose'
Character = mongoose.model 'Character'

class UserService
  constructor: ->

  getUserCharacters: (user, cb) ->
    Character.find {user: user}, (err, data) ->
      cb err, data

module.exports = UserService