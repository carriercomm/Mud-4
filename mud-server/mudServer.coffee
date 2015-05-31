_ = require 'underscore'
Redis = require 'ioredis'
UserService = require './service/UserService'
WorldService = require './service/WorldService'
Communicator = require './controllers/communicator'
Commands = require './controllers/commands'
PlayerStatus = require './controllers/playerStatus'

class MudServer
  constructor: (io) ->
    redis = new Redis 'redis://127.0.0.1:6379/0'
    @_commands = new Commands()
    @_userService = new UserService redis
    @_communicator = new Communicator io
    @_worldService = new WorldService redis

  start: ->
    @_sockets = {}
    @_worldService.loadWorld ->
      console.log 'World loaded...'

  doLogin: (user, socket) ->
    @_sockets[user.id] = socket
    player =
      username: user.id
      status: PlayerStatus.ENTER_WORLD

    @_communicator.welcome socket

    @_userService.getUserCharacters user.id, (err, characters) =>
      playerCharacters = []
      playerCharacters.push character.name for character in characters
      player.characters = playerCharacters

      @_communicator.displayCharacters socket, characters

      @_userService.addPlayer player, =>
        @_userService.setPlayerStatus user.id, PlayerStatus.ENTER_WORLD

  disconnectPlayer: (socket, user) ->
    @_userService.getPlayer user, (err, player) =>
      unless err
        @_userService.removePlayer player
        if player.character
          @_worldService.removeCharacterFromRoom player.character, =>
      else
        # TODO print error

  chooseCharacter: (data, socket) ->
    playerStatus = @_userService.getPlayerStatus data.user, (err, status) =>
      unless err
        command = @_commands.isValid data.command, status

        if command.isValid and !command.needsParam
          @_userService.getCharacterByIndex data.user, data.command - 1, (err, character) =>
            if character
              # if the character has no area and room set, use the base one
              @_worldService.getBaseArea (area) =>
                unless character.area
                  character.area = area.name
                  character.room = area.rooms[0]

                @_worldService.addCharacterToRoom character, character.room, =>
                  @_userService.setPlayerCharacter data.user, character, =>
                    @_userService.setPlayerStatus data.user, PlayerStatus.STANDING, =>
                      @_communicator.loadCharacter socket, character
                      @_communicator.charConnected socket, character.name
                      @look socket, data.user
      else
        # TODO print error

  playerCommand: (data, socket) ->
    playerStatus = @_userService.getPlayerStatus data.user, (err, status) =>
      unless err
        command = @_commands.isValid data.command, status

        if command.isValid
          @_commands.parseCommand data.command, data.body, (err, command, body) =>
            unless err
              @[command](socket, data.user, body)
      else
        # TODO print errors

  ## PLAYER COMMANDS ##
  who: (socket) ->
    @_userService.getPlayers (err, players) =>
      @_communicator.who socket, players

  look: (socket, user) ->
    @_userService.getPlayer user, (err, player) =>
      unless err
        @_worldService.getRoom player.character.room, (room) =>
          @_communicator.displayPlayerRoom socket, room
      else
        # TODO print error

  whisper: (socket, user, body) ->
    body = body.split(/ (.+)/)

    @_userService.getPlayerByCharacter body[0], (toPlayer) =>
      @_userService.getPlayer user, (err, fromPlayer) =>
        unless err
          @_communicator.whisper toPlayer, @_sockets[toPlayer.username], fromPlayer, @_sockets[fromPlayer.username], body
        else
          # TODO print error

  move: (socket, user, direction) ->
    @_userService.getPlayer user, (err, player) =>
      unless err
        @_worldService.getRoomFromExit player.character.room, direction, (room) =>
          if room
            @_worldService.removeCharacterFromRoom player.character, =>
              @_worldService.addCharacterToRoom player.character, room._id, =>
                @_userService.setPlayerRoom player, room._id, =>
                  @look socket, user
      else
        # TODO print error

module.exports = MudServer
  