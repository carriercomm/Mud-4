define [
  "jquery"
], ($) ->
  class Printer
    constructor: ->

    append: (string) ->
      $('#content').append '<span>' + string + '</span> <br/>'