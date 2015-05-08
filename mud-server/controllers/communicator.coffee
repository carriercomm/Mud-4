Output = require '../controllers/output'
Commands = require '../controllers/commands'

class Communicator
  constructor: () ->
    @_out = new Output()
    @_commands = new Commands()

module.exports = Communicator
