UserService = require './service/UserService'
Communicator = require './controllers/communicator'
Commands = require './controllers/commands'
PlayerStatus = require './controllers/playerStatus'

class MudServer
  constructor: () ->
    @_players = []
    @_commands = new Commands()
    @_communicator = new Communicator()
    @_userService = new UserService()

  start: ->

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
          console.log character
          @_players[data.user]['character'] = character

module.exports = MudServer
