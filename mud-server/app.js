var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var mongoose = require('mongoose')
var config = require('./config/database')
var mudServer = require('./js/mudServer')

mongoose.connect(config.url)
server.listen(8080)

var players = {}

io.on('connection', function (socket) {
  mudServer = new MudServer(socket, players)
  mudServer.start()
})
