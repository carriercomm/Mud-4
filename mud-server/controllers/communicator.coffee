mongoose = require 'mongoose'
Output = require '../controllers/output'
Commands = require '../controllers/commands'

class Communicator
  constructor: (@_io) ->
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

  displayPlayerRoom: (socket, room) ->
    socket.emit 'roomDescription', room

  who: (socket, players) ->
    socket.emit 'who', @_out.who players

  whisper: (toPlayer, fromPlayer, messageBody) ->
    if toPlayer
      if messageBody[1] and messageBody[1] != ''
        toChar = toPlayer.character.name
        fromChar = fromPlayer.character.name
        toPlayer.socket.emit 'whisper', @_out.whisper toChar, fromChar, messageBody[1], false
        fromPlayer.socket.emit 'whisper', @_out.whisper toChar, fromChar, messageBody[1], true
      else
        fromPlayer.socket.emit 'whisperError', @_out.whisperErrorNoMessage()
    else
      fromPlayer.socket.emit 'whisperError', @_out.whisperErrorInvalidTarget messageBody[0]

  ## BROADCASTS ##
  charConnected: (socket, character) ->
    socket.broadcast.emit 'charConnected', @_out.charConnected character
      
module.exports = Communicator
