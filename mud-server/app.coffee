app = require('express')()
server = require('http').Server(app)
io = require('socket.io')(server)
mongoose = require 'mongoose'
config = require './config/database'
models = require './models'

MudServer = require './mudServer'

mongoose.connect config.url
server.listen 8080

server = new MudServer io
server.start()

io.on 'connection', (socket) ->
  console.log 'player connected'
  user = ''

  socket.emit 'handshake'

  socket.on 'login', (data) ->
    server.doLogin data, socket
    user = data.id

  socket.on 'chooseCharacter', (data) ->
    server.chooseCharacter data, socket

  socket.on 'playerCommand', (data) ->
    server.playerCommand data, socket

  socket.on 'disconnect', ->
    server.disconnectPlayer socket, user
    console.log 'player disconnected.'