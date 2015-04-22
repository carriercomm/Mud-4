app = require('express')()
server = require('http').Server(app)
io = require('socket.io')(server)
mongoose = require 'mongoose'
config = require './config/database'
models = require './models'

MudServer = require './mudServer'

mongoose.connect config.url
server.listen 8080

players = {}

io.on 'connection', (socket) ->
  server = new MudServer io, socket, players
  server.start()
