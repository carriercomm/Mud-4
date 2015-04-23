(function(window){
  Events = function(client) {
    this._client = client
    this._registerEvents()
  }

  Events.prototype._registerEvents = function() {
    var _this = this
    this._socket = this._client.getSocket()

    this._socket.on('simpleText', function(data) {
      _this._client.onSimpleText(data)
    })

    this._socket.on('handshake', function(data) {
      _this._client.onHandshake(data)
    })
  }

  window.Events = Events
})(this)
