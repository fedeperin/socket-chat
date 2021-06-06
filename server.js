const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const port = process.env.PORT || 3000
const fs = require('fs-extra')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  socket.on('chat message', (msg, name) => {
    socket.broadcast.emit('chat message', msg, name)
  })

  socket.on('disconnect', () => {
    fs.readJson('./public/connections.json', (err, obj) => {
      if (err) console.error(err)
      fs.writeJson('./public/connections.json', {
          connected: obj.connected - 1 
        })
        .then(() => {
          io.emit('someone disconnected')
        })
        .catch(err => {
          console.error(err)
        })
    })
  })
  fs.readJson('./public/connections.json', (err, obj) => {
    if (err) console.error(err)
    fs.writeJson('./public/connections.json', {
        connected: obj.connected + 1 
      })
      .then(() => {
        socket.broadcast.emit('someone connected')
        socket.emit('no broadcast connected')
      })
      .catch(err => {
        console.error(err)
      })
  })
})

server.listen(port, () => {
  console.log('Listening app at the port ' + port)
})