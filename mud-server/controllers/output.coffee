_ = require 'underscore'

class Output
  constructor: ->

  welcome: ->
    'Welcome to tralala MUD'

  chooseCharacter: (data) ->
    chars = 'Select your character: </br>'

    _.each data, (char, i) ->
      chars += "#{i + 1} - #{char.name} (#{char.race} #{char.charClass} level #{char.level})</br>"

    chars

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
    "#{character} has come online."

  whisper: (to, from, message, invert) ->
    if invert
      "You whisper to #{to}: #{message}"
    else
      "#{from} whispers to you: #{message}"

  whisperErrorNoMessage: ->
    "What do you want to whisper?"

  whisperErrorInvalidTarget: (target) ->
    "There's no \"#{target}\" online"

module.exports = Output
