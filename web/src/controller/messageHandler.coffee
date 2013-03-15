define [
  "output/printer"
], (Printer) ->
  class MessageHandler
    constructor: ->
      @_printer = new Printer()

    onMessage: (message) ->
      
