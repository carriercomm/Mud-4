define [
  "output/printer"
  "controller/gameState"
  "jquery"
], (Printer, GameState, $) ->
  class CommandHandler
    constructor: (@_ws) ->
      @_printer = new Printer()
      @_gameState = GameState.getInstance()

    getCommand: (key, text) ->
      if key is 13 and text.length > 0
        @_parseCommand text
        $('#command').val ""

    _parseCommand: (text) ->
      components = text.split ' '
      command = components.shift()
      args = components.join ' '

      if command.toLowerCase() in @_gameState.getValidCommands()
        @_printer.append command.toLowerCase() + ' ' + args, 'command'
      else
        @_printer.append "invalid command: #{command}", 'command'

    _sendCommand: (command) ->
      @_ws.send command

