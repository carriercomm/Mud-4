_ = require 'underscore'
Redis = require 'ioredis'
UserService = require './service/UserService'
WorldService = require './service/WorldService'
Communicator = require './controllers/communicator'
Commands = require './controllers/commands'
PlayerStatus = require './controllers/playerStatus'

class MudServer
  constructor: (io) ->
    @_redis = new Redis()
    @_players = []
    @_commands = new Commands()
    @_userService = new UserService()
    @_communicator = new Communicator io
    @_worldService = new WorldService @_redis

  start: ->
    @_worldService.loadWorld()

  ## PLAYR METHODS ##
  getPlayer: (user) ->
    player = _.find @_players, (player) =>
      return player.username == user

  getPlayerBySocket: (socket) ->
    player = _.find @_players, (player) =>
      return player.socket.id == socket.id

  getPlayerByCharacter: (character) ->
    player = _.find @_players, (player) =>
      return player.character.name.toLowerCase() == character.toLowerCase()

  playerStatus: (user, status) ->
    player = @getPlayer user

    if status
      player.status = status
    else
      player.status

  getPlayerCharacters: (user) ->
    player = @getPlayer user
    player.characters

  setPlayerCharacter: (user, character) =>
    player = @getPlayer user
    player.character = character

  doLogin: (user, socket) ->
    player =
      username: user.id
      socket:socket
      status: PlayerStatus.ENTER_WORLD

    @_communicator.welcome socket

    @_userService.getUserCharacters user.id, (err, characters) =>
      playerCharacters = []
      playerCharacters.push character.name for character in characters
      player.characters = playerCharacters

      @_players.push player

      @_communicator.displayCharacters socket, characters

  disconnectPlayer: (socket) ->
    player = @getPlayerBySocket socket

    @_worldService.removeCharacterFromRoom player.character, =>
      @_players.splice(@_players.indexOf(player), 1)

  chooseCharacter: (data, socket) ->
    command = @_commands.isValid data.command, @playerStatus data.user

    if command.isValid and !command.needsParam
      @_userService.getCharacter @getPlayerCharacters(data.user), data.command - 1, (err, character) =>
        unless err
          @playerStatus data.user, PlayerStatus.STANDING

          # if the character has no area and room set, use the base one
          unless character.area
            @_worldService.getBaseArea (area) =>
              character.area = area.name
              character.room = area.rooms[0]
              @_worldService.addCharacterToRoom character, character.room, =>

                @setPlayerCharacter data.user, character
                @_communicator.loadCharacter socket, character
                @_communicator.charConnected socket, character.name
                @look socket, data.user

  playerCommand: (data, socket) ->
    command = @_commands.isValid data.command, @playerStatus data.user

    if command.isValid
      @_commands.parseCommand data.command, data.body, (err, command, body) =>
        unless err
          @[command](socket, data.user, body)

  ## PLAYER COMMANDS ##
  who: (socket) ->
    @_communicator.who socket, @_players

  look: (socket, user) ->
    player = @getPlayer user

    @_worldService.getRoom player.character.room, (room) =>
      @_communicator.displayPlayerRoom socket, room

  whisper: (socket, user, body) ->
    body = body.split(/ (.+)/)

    toPlayer = @getPlayerByCharacter body[0]
    fromPlayer = @getPlayer user

    @_communicator.whisper toPlayer, fromPlayer, body

  move: (socket, user, direction) ->
    player = @getPlayer user

    @_worldService.getRoomFromExit player.character.room, direction, (room) =>
      if room
        @_worldService.removeCharacterFromRoom player.character, =>
          @_worldService.addCharacterToRoom player.character, room._id, =>

            # update character room
            player.character.room = room._id
            @look socket, user

module.exports = MudServer
  