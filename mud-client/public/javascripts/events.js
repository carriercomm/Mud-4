(function (window) {
  var Events = function (client) {
    this._client = client
    this._registerEvents()
  }

  Events.prototype._registerEvents = function () {
    var _this = this
    this._socket = this._client.getSocket()

    $('#prompt').keydown(function(event) {
      switch (event.keyCode) {
        case 27:
          $('#prompt_input').val('')

          break
        case 13:
          _this._client.sendCommand($('#prompt_input').val())
          $('#prompt_input').val('')

          break
        default:
          break
      }
    })

    this._socket.on('simpleText', function (data) {
      _this._client.onSimpleText(data)
    })

    this._socket.on('handshake', function (data) {
      _this._client.onHandshake(data)
    })
  }

  window.Events = Events
})(this)
