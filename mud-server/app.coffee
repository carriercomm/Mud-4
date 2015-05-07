app = require('express')()
server = require('http').Server(app)
io = require('socket.io')(server)
mongoose = require 'mongoose'
config = require './config/database'
models = require './models'

MudServer = require './mudServer'
Communicator = require './controllers/communicator'

mongoose.connect config.url
server.listen 8080

server = new MudServer()
server.start()

io.on 'connection', (socket) ->
  communicator = new Communicator socket, server
  communicator.handshake()