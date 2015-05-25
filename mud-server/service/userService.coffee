Redis = require 'ioredis'
mongoose = require 'mongoose'
Character = mongoose.model 'Character'

class UserService
  constructor: ->
    @_redis = new Redis()

  getUserCharacters: (user, cb) ->
    Character.find {user: user}, (err, data) ->
      cb err, data

  getCharacter: (characters, index, cb) ->
    if characters[index]
      name = characters[index]

      query =
        name: name

      Character.findOne query, (err, character) ->
        cb err, character
    else
      cb "Error selecting character", null

module.exports = UserService
