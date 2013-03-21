define [
  "output/printer"
  "controller/gameState"
], (Printer, GameState) ->
  class MessageHandler
    constructor: ->
      @_printer = new Printer()
      @_gameState = GameState.getInstance()

    onMessage: (jsonMessage) ->
      message = JSON.parse jsonMessage

      @_gameState.setState message.state

      switch message.message_name
        when 'auto_print'
          @_printer.append message.text, message.css
        else
          console.log 'not yet implemented'
