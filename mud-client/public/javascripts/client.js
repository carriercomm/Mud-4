(function(window){
  MudClient = function(){
    $('.scroll-filler').height($('#content').height() - $('#container').height() - $('#prompt').height())

    this._socket = io("http://localhost:8080")

    this._socket.on('connect', function () {
      console.log('connected with mud server')
    })

    this._socket.on('connect_error', function(data) {
      console.log('connection error: ' + data)
    })
  }

  MudClient.prototype.getSocket = function() {
    return this._socket
  }

  MudClient.prototype.appendText = function(data) {
     $('#container').append("<div class='element'>" + data.text + "</div>")
     $("#content").animate({ scrollTop: $('#container').height() }, 1000)
     // $('#content').scrollTop($('#container').height())
  }

  MudClient.prototype.onSimpleText = function(data) {
    this.appendText(data)
  }

  MudClient.prototype.onHandshake = function(data) {
    var user = $('#user-id').val()

    this._socket.emit('login', {
      user: user
    })
  }

  window.MudClient = MudClient
})(this)
