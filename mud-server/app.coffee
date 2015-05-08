app = require('express')()
server = require('http').Server(app)
io = require('socket.io')(server)
mongoose = require 'mongoose'
config = require './config/database'
models = require './models'

MudServer = require './mudServer'

mongoose.connect config.url
server.listen 8080

server = new MudServer()
server.start()

io.on 'connection', (socket) ->
  socket.emit 'handshake'

  socket.on 'login', (data) ->
    server.doLogin data, socket
