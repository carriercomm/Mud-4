UserService = require './service/UserService'
Communicator = require './controllers/communicator'

class MudServer
  constructor: () ->
    @_players = []
    @_communicator = new Communicator()
    @_userService = new UserService()

  start: ->

  doLogin: (userId, socket) ->
    @_players[userId] = {}
    @_players[userId]['socket'] = socket

module.exports = MudServer
