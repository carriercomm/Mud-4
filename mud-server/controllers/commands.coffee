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
        'whisper'
      ]
    }

    isValid = 
      isValid: validCommands[status].indexOf(command) != -1
      needsParam: @needsParam command

  needsParam: (command) ->
    commandsWithParam = [
      'whisper'
    ]

    commandsWithParam.indexOf(command) != -1

  parseCommand: (command, body, cb) ->
    if command in ['n', 'e', 's', 'w', 'u', 'd']
      command = 'move'
      body = command

    cb null, command, body

module.exports = Commands
