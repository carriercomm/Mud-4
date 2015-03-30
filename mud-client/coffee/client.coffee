class MudClient

  constructor: ->
    $('html').click ->
      $('#prompt_input').focus()

    @_socket = io.connect 'http://localhost:8080'
