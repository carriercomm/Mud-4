require.config
  paths:
    jquery:  "../lib/jquery-1.9.1.min"

require [
  "controller/gameConnection"
  "controller/facebookApi"
  "output/printer"
  "controller/commandHandler"
  "jquery"
], (GameConnection, FacebookApi, Printer, CommandHandler, $) ->

  connectToGame = (fb) =>
    $('#wrapper').css 'display', 'block'
    $('#promptContainer').css 'display', 'block'
    $('#login').css 'display', 'none'

    printer = new Printer()
    printer.append "Connecting to the game..."

    fb.getUserData (userData) =>
      if userData.error?
        printer.append "Error fetching user data from facebook..."
        return

      gameConnection = new GameConnection userData
      gameConnection.connectToGame (ws) =>
        commandHandler = new CommandHandler ws
        $('#command').keyup (event) =>
          commandHandler.getCommand event.which, $('#command').val()

      $('#wrapper').click =>
        $('#command').focus()

  new FacebookApi (fb) ->
    $('#loginFbBt').click =>
      fb.login (userData) =>
        console.log "Logged in as #{userData.first_name} #{userData.last_name}"
        connectToGame fb

    fb.getLoginStatus (response) =>
      unless response.status == 'connected'
        $('#wrapper').css 'display', 'none'
        $('#promptContainer').css 'display', 'none'
        $('#login').css 'display', 'block'
      else
        connectToGame fb
        
          