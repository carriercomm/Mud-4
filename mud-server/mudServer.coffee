UserService = require './service/UserService'
Communicator = require './controllers/communicator'

class MudServer
  constructor: () ->
    @_players = []
    @_communicator = new Communicator()
    @_userService = new UserService()

  start: ->

  doLogin: (user, socket) ->
    @_players[user.id] = {}
    @_players[user.id]['socket'] = socket

    @_communicator.welcome socket

    @_userService.getUserCharacters user.id, (err, characters) =>
      playerCharacters = []
      playerCharacters.push character.name for character in characters
      @_players[user.id]['characters'] = playerCharacters
      @_communicator.displayCharacters socket, characters

  chooseCharacter: (data, socket) ->
    # TODO: select character

module.exports = MudServer
