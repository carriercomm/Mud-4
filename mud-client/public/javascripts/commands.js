(function (window) {
  var Commands = function () {}

  Commands.prototype.isValid = function (command, status) {
    var validCommands = {
      enterWorld: ['1', '2', '3', '4'],
      standing: [
        'n',
        's',
        'e',
        'w',
        'who',
        'look',
        'whisper'
      ]
    }

    return {
      isValid: validCommands[status].indexOf(command) !== -1,
      needsParam: this.needsParam(command)
    }
  }

  Commands.prototype.needsParam = function (command) {
    var commandsWithParam = [
      'whisper'
    ]

    return commandsWithParam.indexOf(command) !== -1
  }

  window.Commands = Commands
})(this)
