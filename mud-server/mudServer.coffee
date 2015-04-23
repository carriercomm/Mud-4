UserService = require './service/UserService'
Output = require './controllers/output'

class MudServer
  constructor: (@_socket) ->
    @_userService = new UserService()
    @_out = new Output()

    # Welcome message fired on connection
    @_socket.emit 'simpleText', @_out.welcome()

    # Server events    
    @_socket.on 'login', (data) =>
      @doLogin data

    @_socket.on 'playerMessage', (data) =>

  start: ->
    @handshake()

  handshake: ->
    @_socket.emit 'handshake'

  doLogin: (data) ->
    chars = @_userService.getUserCharacters data.user, (err, data) =>
      @_socket.emit 'simpleText', @_out.chooseCharacter data

module.exports = MudServer
