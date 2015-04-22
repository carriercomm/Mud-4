class MudServer
  constructor: (@_socket, @_players) ->
  
  start: ->
    @handshake()

  handshake: ->
    
    
module.exports = MudServer