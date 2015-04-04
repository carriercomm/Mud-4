(function(window){
  Events = function(client) {
    this._client = client;
    this._registerEvents();
  }

  Events.prototype._registerEvents = function() {
    var _this = this;
    this._socket = this._client.getSocket();

    this._socket.on('news', function(data) {
      _this._client.onNews(data);
    });
  }

  window.Events = Events;
})(this);
