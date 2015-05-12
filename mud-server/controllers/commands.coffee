validCommands = {
  enterWorld: ['1', '2', '3', '4']
}

needParam = {
  enterWorld: false
}

class Commands
  constructor: ->

  isValid: (command, status) ->
    isValid = 
      isValid: validCommands[status].indexOf command != -1
      needsParam: needParam[status]

module.exports = Commands