UserService = require './service/UserService'
WorldService = require './service/WorldService'
Communicator = require './controllers/communicator'
Commands = require './controllers/commands'
PlayerStatus = require './controllers/playerStatus'

class MudServer
  constructor: ->
    @_players = []
    @_commands = new Commands()
    @_communicator = new Communicator()
    @_userService = new UserService()
    @_worldService = new WorldService()

  start: ->
    @_worldService.loadWorld()

  doLogin: (user, socket) ->
    @_players[user.id] = {}
    @_players[user.id]['socket'] = socket
    @_players[user.id]['status'] = PlayerStatus.ENTER_WORLD

    @_communicator.welcome socket

    @_userService.getUserCharacters user.id, (err, characters) =>
      playerCharacters = []
      playerCharacters.push character.name for character in characters
      @_players[user.id]['characters'] = playerCharacters
      @_communicator.displayCharacters socket, characters

  chooseCharacter: (data, socket) ->
    command = @_commands.isValid data.command, @_players[data.user]['status']

    if command.isValid and !command.needsParam
      @_userService.getCharacter @_players[data.user]['characters'], data.command - 1, (err, character) =>
        unless err
          # if the character has no set area and room, use the base one
          unless character.area
            baseArea = @_worldService.getBaseArea()
            console.log baseArea.name
            character.area = baseArea.name
            character.room = baseArea.rooms[0]

          console.log character
          @_players[data.user]['character'] = character
          @_communicator.loadCharacter socket, character

module.exports = MudServer
