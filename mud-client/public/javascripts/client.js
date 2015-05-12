(function (window) {
  var $ = window.$,
      io = window.io,
      PlayerStatus = window.PlayerStatus,
      Commands = window.Commands

  var MudClient = function () {
    this.setPlayerStatus(PlayerStatus.ENTER_WORLD)

    // filler div to force the content to appear at the bottom of the terminal
    $('.scroll-filler').height($('#content').height() - $('#container').height() - $('#prompt').height())

    this._socket = io('http://localhost:8080')

    this._socket.on('connect', function () {
      console.log('connected with mud server')
    })

    this._socket.on('connect_error', function (data) {
      console.log('connection error: ' + data)
    })

    this._commands = new Commands()
  }

  MudClient.prototype.getSocket = function () {
    return this._socket
  }

  MudClient.prototype.setPlayerStatus = function (status) {
    this.playerStatus = status
  }

  MudClient.prototype.getPlayerStatus = function () {
    return this.playerStatus
  }

  MudClient.prototype.sendCommand = function (c) {
    var splitCommand = c.split(/ (.+)/),
        command = this._commands.isValid(splitCommand[0], this.playerStatus)

    if (command.isValid) {
      // some commands require parameters, others don't
      if (command.needsParam) {
        if (splitCommand[1]) {
          this.sendMessage({
            command: splitCommand[0],
            body: splitCommand[1]
          })
        } else {
          this.appendText({
            text: 'What do you want to ' + splitCommand[0] + '?'
          })
        }
      } else {
        this.sendMessage({
          command: splitCommand[0],
          body: null
        })
      }
    } else {
      this.appendText({
        text: 'Invalid command: ' + splitCommand[0]
      })
    }
  }

  MudClient.prototype.appendText = function (data) {
    $('#container').append('<div class="element">' + data.text + '</div>')
    $('#content').animate({ scrollTop: $('#container').height() }, 1000)
  }

  MudClient.prototype.sendMessage = function (data) {
    var user = $('#user-id').val()
    data.user = user

    if (this.playerStatus === PlayerStatus.ENTER_WORLD) {
      this._socket.emit('chooseCharacter', data)
    } else {
      this._socket.emit('playerMessage', data)
    }
  }

  /**
   * Socket events
   */

  MudClient.prototype.onSimpleText = function (data) {
    this.appendText(data)
  }

  MudClient.prototype.onHandshake = function (data) {
    var user = $('#user-id').val()

    this._socket.emit('login', {
      id: user
    })
  }

  window.MudClient = MudClient
})(this)
