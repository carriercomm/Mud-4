Output = require '../controllers/output'
Commands = require '../controllers/commands'

class Communicator
  constructor: ->
    @_out = new Output()
    @_commands = new Commands()

  _simpleText: (socket, message) ->
    socket.emit 'simpleText', message

  welcome: (socket) ->
    @_simpleText socket, @_out.welcome()

  displayCharacters: (socket, characters) ->
    @_simpleText socket, @_out.chooseCharacter characters

  loadCharacter: (socket, character) ->
  	data =
  		character: character
  		text: @_out.loadCharacter character

  	socket.emit 'loadCharacter', data

module.exports = Communicator
