var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');

server.listen(8080);

io.on('connection', function (socket) {
  console.log("new connection");
  socket.emit('news', { hello: 'world' });
});
