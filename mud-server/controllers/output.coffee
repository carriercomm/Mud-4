_ = require 'underscore'

class Output
  constructor: ->

  welcome: ->
    data =
      text: 'Welcome to tralala MUD'

  chooseCharacter: (data) ->
    chars = 'Select your character: </br>'

    _.each data, (char, i) ->
      chars += "#{i + 1} - #{char.name} (#{char.charClass} level #{char.level})</br>"

    data =
      text: chars

  loadCharacter: (data) ->
    "You feel the essence of #{data.name} entering your soul..."

  who: (players) ->
    text = 'Players online right now: </br>'

    _.each players, (player) ->
      c = player.character
      if c
        text += "</br>[ #{c.level} ] - #{c.name} (#{c.race} #{c.charClass})"

    text

module.exports = Output
