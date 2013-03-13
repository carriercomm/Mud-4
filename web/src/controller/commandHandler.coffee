define [
  "output/printer"
  "jquery"
], (Printer, $) ->
  class GameConnection
    constructor: (@_userData) ->
      @_printer = new Printer()

    getCommand: (key, text) ->
      if key is 13
        console.log text
        $('#command').val ""
