(function (window) {
  var $ = window.$

  var Events = function (client) {
    this._client = client
    this._registerEvents()
  }

  Events.prototype._registerEvents = function () {
    var self = this
    this._socket = this._client.getSocket()

    $('#prompt').keydown(function (event) {
      if ($('#prompt_input').val() === '') return

      switch (event.keyCode) {
        case 27:
          $('#prompt_input').val('')

          break
        case 13:
          self._client.sendCommand($('#prompt_input').val())
          $('#prompt_input').val('')

          break
        default:
          break
      }
    })

    this._socket.on('simpleText', function (data) {
      self._client.onSimpleText(data)
    })

    this._socket.on('handshake', function (data) {
      self._client.onHandshake(data)
    })

    this._socket.on('loadCharacter', function (data) {
      self._client.onLoadCharacter(data)
    })

    this._socket.on('roomDescription', function (data) {
      self._client.onRoomDescription(data)
    })

    this._socket.on('who', function (data) {
      self._client.onWho(data)
    })

    this._socket.on('whisper', function (data) {
      self._client.onWhisper(data)
    })

    this._socket.on('whisperError', function (data) {
      self._client.onError(data)
    })

    // BROADCASTS
    this._socket.on('charConnected', function (data) {
      self._client.onCharConnected(data)
    })
  }

  window.Events = Events
})(this)
