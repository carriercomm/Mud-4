class Commands
  constructor: ->

  isValid: (command, status) ->
    validCommands = {
      enterWorld: ['1', '2', '3', '4'],
      standing: [
        'n'
        's'
        'e'
        'w'
        'who'
        'look'
        'kill'
      ]
    }

    isValid = 
      isValid: validCommands[status].indexOf(command) != -1
      needsParam: @needsParam command

  needsParam: (command) ->
    commandsWithParam = [
      'kill'
    ]

    commandsWithParam.indexOf(command) != -1

  parseCommand: (command, body, cb) ->
    cb null, command, body

module.exports = Commands
