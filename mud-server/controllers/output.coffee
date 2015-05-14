class Output
  constructor: ->

  welcome: ->
    data =
      text: "Welcome to tralala MUD"

  chooseCharacter: (data) ->
    chars = "Select your character: </br>"

    for char, i in data
      chars += "#{i + 1} - #{char.name} (#{char.charClass} level #{char.level})</br>"

    data =
      text: chars

  loadCharacter: (data) ->
    "You feel the essence of #{data.name} entering your soul..."

module.exports = Output
