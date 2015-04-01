class window.MudClient
  constructor: ->
    @_socket = io("http://localhost:8080");

    @_socket.connect()


  getSocket: ->
    @_socket

  onNews: (data) ->
    console.log data
