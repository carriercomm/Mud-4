Inout = require './controllers/inout'

class MudServer
  constructor: (@_io, @_socket, @_players) ->
    @_inout = new Inout()

    @_socket.on 'login', (data) =>
      @doLogin data

  start: ->
    @handshake()

  handshake: ->
    @_socket.emit 'handshake'

  doLogin: (data) ->
    char = @_inout.logUser data.user
    console.log char.name

module.exports = MudServer
