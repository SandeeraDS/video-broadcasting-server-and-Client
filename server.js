
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

// our localhost port
const port = 4001

const app = express()

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('User connected')

  //listenn to broadcaster and sent it in to client
  socket.on('broadcaster', function () {
    //id of the broadcaster
    broadcaster = socket.id;
    console.log("come " + socket.id)
    //socket.broadcast.emit('broadcaster');
    io.sockets.emit('broadcaster')
  });


  //get from watcher and send to broadcaster
  socket.on('watcher', function () {
    //tell to broadcast there is a watcher
    console.log("come watcher  " + socket.id)
    io.sockets.emit('watcher', socket.id);
  });

  //send sdp to watcher
  socket.on('offer', function (id /* of the watcher */, message) {
    console.log("message==>" + message)
    io.sockets.emit('offer', socket.id /* of the broadcaster */, message);
  });

  //send sdp of client
  socket.on('answer', function (id /* of the broadcaster */, message) {
    console.log("answer " + message)
    io.sockets.emit('answer', socket.id /* of the watcher */, message);
  });

  //share network details
  socket.on('candidate', function (id, message) {
    io.sockets.emit('candidate', socket.id, message);
  });

  socket.on('candidated', function (id, message) {
    io.sockets.emit('candidated', socket.id, message);
  });


  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

})

server.listen(port, () => console.log(`Listening on port ${port}`));