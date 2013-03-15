define [
  "jquery"
], ($) ->
  class Printer
    constructor: ->

    append: (string, css = 'default') ->
      $('#board').append "<div class=\"#{css}\">#{string}</div>"
      $('#wrapper').scrollTop $('#board')[0].scrollHeight
      height = $('#wrapper')[0].clientHeight - $('#board')[0].scrollHeight
      height = 0 if height < 0
      $('#topAdjust').css 'height', height + 'px'