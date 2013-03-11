define [
  "game"
  "printer"
], (Game, Printer) ->
  class GameConnection
    constructor: ->
      @_printer = new Printer()

    initialize: ->
      @_printer.append "You need to log in first!"
      @_printer.append "Enter your username below."