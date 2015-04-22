mongoose = require 'mongoose'
Character = mongoose.model 'Character'

class Inout
  constructor: ->

  logUser: (user) ->
    Character.find {user: user}, (err, character) ->    
      character

module.exports = Inout
