class window.Events
  constructor: (@_client) ->
    @_registerEvents()

  _registerEvents: ->
    @_socket = @_client.getSocket();

    @_socket.on 'news', (data) =>
      @_client.onNews data
