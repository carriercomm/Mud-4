define [
  "output/printer"
  "controller/messageHandler"
], (Printer, MessageHandler) ->
  class GameConnection
    constructor: (@_userData) ->
      @_printer = new Printer()
      @_messageHandler = new MessageHandler()

    connectToGame: ->
      @_ws = new WebSocket 'ws://localhost:8080'
      
      @_ws.onopen = =>
        @_printer.append "Connected :D Welcome #{@_userData.first_name}!"
        
        @_ws.onmessage = (evt) =>
          @_messageHandler.onMessage evt

      @_ws.onclose = =>
        @_printer.append 'Connection with game ended... :('
