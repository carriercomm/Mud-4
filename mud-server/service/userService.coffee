_ = require 'underscore'
mongoose = require 'mongoose'
Character = mongoose.model 'Character'

class UserService
  constructor: (@_redis) ->

  getPlayers: (cb) ->
    @_redis.get 'players', (err, players) =>
      cb err, JSON.parse players

  addPlayer: (player, cb) ->
    @getPlayers (err, players) =>
      unless players
        players = []

      p = _.find players, (p) =>
        return p.username == player.username

      unless p
        players.push player
        @_redis.set 'players', JSON.stringify players

      cb()

  removePlayer: (player) ->
    @getPlayers (err, players) =>
      players.splice(players.indexOf(player), 1)

      @_redis.set 'players', JSON.stringify players

  getPlayer: (user, cb) ->
    @getPlayers (err, players) =>
      player = _.find players, (player) =>
        return player.username == user

      if player
        cb null, player
      else
        cb "Error retrieving player", null

  getPlayerByCharacter: (character, cb) ->
    @getPlayers (err, players) =>
      player = _.find players, (player) =>
        return player.character.name.toLowerCase() == character.toLowerCase()

      cb player

  getPlayerStatus: (user, cb) ->  
    @getPlayer user, (err, player) =>
      if err
        cb err, null
      else
        cb null, player.status

  setPlayerStatus: (user, status, cb) ->
    @getPlayers (err, players) =>
      player = _.find players, (player) =>
        return player.username == user

      if player
        player.status = status
        @_redis.set 'players', JSON.stringify players

      cb() if cb

  getUserCharacters: (user, cb) ->
    Character.find {user: user}, (err, data) ->
      cb err, data

  getCharacterByIndex: (user, index, cb) ->
    @getPlayers (err, players) =>
      player = _.find players, (player) =>
        return player.username == user

      if player.characters[index]
        name = player.characters[index]

        query =
          name: name

        Character.findOne query, (err, character) ->
          cb err, character
      else
        cb "Error selecting character", null

  setPlayerCharacter: (user, character, cb) =>
    @getPlayers (err, players) =>
      player = _.find players, (player) =>
        return player.username == user

      if player
        index = _.indexOf players, player

        player.character = character
        players.splice index, 1, player
        @_redis.set 'players', JSON.stringify players

      cb()


  setPlayerRoom: (player, room, cb) =>
    @getPlayers (err, players) =>
      player = _.find players, (p) =>
        return p.username == player.username

      if player
        index = _.indexOf players, player

        player.character.room = room
        players.splice index, 1, player
        @_redis.set 'players', JSON.stringify players

      cb()

module.exports = UserService
