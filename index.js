const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.broadcast.emit('someone connected')
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });
    socket.on('typing', () => {
        socket.broadcast.emit('typing');
    });
    socket.on('no typing', () => {
        socket.broadcast.emit('no typing');
    });
    socket.on('disconnect', () => {
      io.emit('someone disconnected')
    });
});

server.listen(port, () => {
  console.log('Escuchando en el puerto ' + port);
});