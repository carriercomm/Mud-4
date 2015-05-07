Output = require '../controllers/output'
Commands = require '../controllers/commands'

class Communicator
  constructor: (@_socket, @_server) ->
    @_out = new Output()
    @_commands = new Commands()

    # Welcome message fired on connection
    @emit 'simpleText', @_out.welcome()

    # Server events    
    @_socket.on 'login', (data) =>
      @_server.doLogin data, (err, data) =>
        @doLogin err, data

    @_socket.on 'playerMessage', (data) =>
      console.log data

  emit: (message, data) ->
    @_socket.emit message, data

  handshake: ->
    @emit 'handshake'

  doLogin: (err, data) ->
    if data and data.length
        @emit 'simpleText', @_out.chooseCharacter data

module.exports = Communicator