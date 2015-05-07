(function (window) {
  var $ = window.$,
      io = window.io,
      PlayerStatus = window.PlayerStatus

  var MudClient = function () {
    this.playerStatus = PlayerStatus.ENTER_WORLD

    $('.scroll-filler').height($('#content').height() - $('#container').height() - $('#prompt').height())

    this._socket = io('http://localhost:8080')

    this._socket.on('connect', function () {
      console.log('connected with mud server')
    })

    this._socket.on('connect_error', function (data) {
      console.log('connection error: ' + data)
    })
  }

  MudClient.prototype.getSocket = function () {
    return this._socket
  }

  MudClient.prototype.sendCommand = function (command) {
    var splitCommand = command.split(/ (.+)/)

    if (commandIsValid(splitCommand[0], this.playerStatus)) {
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
    this._socket.emit('playerMessage', data)
  }

  MudClient.prototype.onSimpleText = function (data) {
    this.appendText(data)
  }

  MudClient.prototype.onHandshake = function (data) {
    var user = $('#user-id').val()

    this._socket.emit('login', {
      user: user
    })
  }

  window.MudClient = MudClient
})(this)
