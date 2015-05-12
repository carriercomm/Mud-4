(function (window) {
  var Commands = function () {}

  Commands.prototype.isValid = function (command, status) {
    var validCommands = {
      enterWorld: ['1', '2', '3', '4']
    }

    var needParam = {
      enterWorld: false
    }

    return {
      isValid: validCommands[status].indexOf(command) !== -1,
      needsParam: needParam[status]
    }
  }

  window.Commands = Commands
})(this)
