(function(window){
  MudClient = function(){
    this._socket = io("http://localhost:8080");

    this._socket.on('connect', function () {
      console.log('connected');
    });

    this._socket.on('connect_error', function(data) {
      console.log('connection error: ' + data);
    });
  }

  MudClient.prototype.getSocket = function() {
    return this._socket;
  }

  MudClient.prototype.onNews = function(data) {
    console.log(data);
  }

  window.MudClient = MudClient;
})(this);
