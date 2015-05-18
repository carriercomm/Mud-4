(function (window) {
  var $ = window.$,
      io = window.io,
      PlayerStatus = window.PlayerStatus,
      Commands = window.Commands,
      _ = window._

  var MudClient = function () {
    var self = this

    // filler div to force the content to appear at the bottom of the terminal
    $('.scroll-filler').height($('#content').height() - $('#container').height() - $('.hud-bottom').height())

    this.setPlayerStatus(PlayerStatus.ENTER_WORLD)

    this._socket = io('http://localhost:8080')

    this._socket.on('connect', function () {
      console.log('connected with mud server')

      $('.hud-bottom').addClass('hidden')
      self.setPlayerStatus(PlayerStatus.ENTER_WORLD)
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
            css: 'error',
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
        css: 'error',
        text: 'Invalid command: ' + splitCommand[0]
      })
    }
  }

  MudClient.prototype.appendText = function (data) {
    if ($('#container').height() >= $('#content').height()) {
      $('.scroll-filler').height(0)
    }

    $('#container').append('<div class="element ' + data.css + '">' + data.text + '</div>')
    $('#content').scrollTop($('#container').height())
  }

  MudClient.prototype.sendMessage = function (data) {
    var user = $('#user-id').val()
    data.user = user

    if (this.playerStatus === PlayerStatus.ENTER_WORLD) {
      this._socket.emit('chooseCharacter', data)
    } else {
      this._socket.emit('playerCommand', data)
    }
  }

  MudClient.prototype.updateHud = function (character) {
    $('#player-life').html('Hp: ' + character.life)
    $('#player-energy').html('Sp: ' + character.energy)
  }

  /**
   * Socket events
   */

  MudClient.prototype.onSimpleText = function (data) {
    this.appendText({
      css: '',
      text: data
    })
  }

  MudClient.prototype.onError = function (data) {
    this.appendText({
      css: 'error',
      text: data
    })
  }

  MudClient.prototype.onHandshake = function (data) {
    var user = $('#user-id').val()

    this._socket.emit('login', {
      id: user
    })
  }

  MudClient.prototype.onLoadCharacter = function (data) {
    $('.hud-bottom').removeClass('hidden')
    $('#char-name').html(data.character.name + ' (' + data.character.level + ')')
    $('#next-lvl').html('Next level: ' + data.character.nextLevel + '%')
    $('#area').html('Area: ' + data.character.area)

    data.css = ''
    this.appendText(data)
    this.updateHud(data.character)
    this.setPlayerStatus(PlayerStatus.STANDING)
  }

  MudClient.prototype.onRoomDescription = function (room) {
    var title = {
      css: 'room-title',
      text: room.title
    }

    var description = {
      css: 'room-description',
      text: room.description
    }

    this.appendText(title)
    this.appendText(description)

    var exits = {
      css: 'room-exits',
      text: 'Exits: [ '
    }

    _.each(room.exits, function (exit, index) {
      exits.text += exit.direction

      if (index === room.exits.length - 1) {
        exits.text += ' ]'
      } else {
        exits.text += ' | '
      }
    })

    this.appendText(exits)
  }

  MudClient.prototype.onWho = function (data) {
    this.appendText({
      css: 'who',
      text: data
    })
  }

  MudClient.prototype.onCharConnected = function (data) {
    this.appendText({
      css: 'char-connected',
      text: data
    })
  }

  MudClient.prototype.onWhisper = function (data) {
    this.appendText({
      css: 'whisper',
      text: data
    })
  }

  window.MudClient = MudClient
})(this)
