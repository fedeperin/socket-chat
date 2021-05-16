const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    socket.broadcast.emit('someone connected')

    socket.on('chat message', (msg, name) => {
        socket.broadcast.emit('chat message', msg, name)
    })

    socket.on('disconnect', () => {
      io.emit('someone disconnected')
    })
})

server.listen(port, () => {
  console.log('Escuchando aplicación en el puerto ' + port)
})