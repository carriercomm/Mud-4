_ = require 'underscore'

class Output
  constructor: ->

  welcome: ->
    data =
      text: 'Welcome to tralala MUD'

  chooseCharacter: (data) ->
    chars = 'Select your character: </br>'

    _.each data, (char, i) ->
      chars += "#{i + 1} - #{char.name} (#{char.race} #{char.charClass} level #{char.level})</br>"

    data =
      text: chars

  loadCharacter: (data) ->
    "You feel the essence of #{data.name} entering your soul..."

  who: (players) ->
    text = 'Players online right now: </br>'

    _.each players, (player) ->
      c = player.character
      if c
        text += "</br>[ #{c.level} ] - #{c.name} (<span class='#{c.charClass}'>#{c.race} #{c.charClass}</span>)"

    text

  charConnected: (character) ->
    text = "#{character} has come online."

module.exports = Output
