class Output
  constructor: ->

  welcome: ->
    data =
      text: "Welcome to tralala MUD"

  chooseCharacter: (data) ->
    chars = "Select your character: </br>"

    for char, i in data
      chars += "#{i + 1} - #{char.name} </br>"

    data =
      text: chars

module.exports = Output
