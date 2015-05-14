mongoose = require 'mongoose'
Character = mongoose.model 'Character'

class UserService
  constructor: ->

  getUserCharacters: (user, cb) ->
    Character.find {user: user}, (err, data) ->
      cb err, data

  getCharacter: (characters, index, cb) ->
    name = characters[index]

    query =
      name: name

    Character.findOne query, (err, character) ->
      cb err, character

module.exports = UserService