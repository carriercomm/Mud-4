UserService = require './service/UserService'

class MudServer
  constructor: () ->
    @_userService = new UserService()

  start: ->

  doLogin: (data, cb) ->
    chars = @_userService.getUserCharacters data.user, (err, data) =>
      cb(err, data)

module.exports = MudServer
