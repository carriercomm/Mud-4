define [
  "output/printer"
  "utils/commandList"
  "jquery"
], (Printer, CommandList, $) ->
  class CommandHandler
    constructor: (@_ws) ->
      @_printer = new Printer()

    getCommand: (key, text) ->
      if key is 13 and text.length > 0
        @_parseCommand text
        $('#command').val ""

    _parseCommand: (text) ->
      components = text.split ' '
      command = components.shift()
      args = components.join ' '

      if command in CommandList
        @_printer.append command + ' ' + args, 'command'
      else
        @_printer.append 'invalid command', 'command'

    _sendCommand: (command) ->
      @_ws.send command

