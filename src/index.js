const express = require('express')
const http = require('http')
const socket = require('socket.io')
const PORT = process.env.PORT || 3001
const cookieParser = require('cookie-parser')
const cookie = require('cookie')
const user = require('./routes/user')
const friendRequest = require('./utils/friendRequest')
const Redis = require('ioredis')
const authorizeConnection = require('./utils/authorizeConnection')

const app = express()
// Create server and pass in the express app
const server = http.createServer(app)
// Initialize socketio and pass in the server
const io = socket(server)
const redis = new Redis()

app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/user', user)

io.use(async (socket, next) => {
    const token = cookie.parse(socket.handshake.headers.cookie).token
    authorizeConnection(token, async (err, data) => {
        if (err) {
            console.log(err)
            next(new Error(err))
        }
        else {
            const username = data
            socket.handshake.auth.user = username
            try {
                await redis.set(username, socket.id)
                next()
            }
            catch (e) {
                next(new Error(e))
            }
        }
    })
})


io.on('connection', (socket) => {

    console.log(socket.handshake.auth.user + ' connected')
    //console.log(socket.handshake.auth.user)
   // const response = await redis.get(socket.handshake.auth.user)
    socket.emit('welcome message', "Welcome!")

    socket.on('send message', (message, callback) => {
        
        io.emit('message', message)
        callback('Message delivered')
    })

    socket.on('friend-request', async (username, callback) => {
        friendRequest(io, socket, redis, username, callback)
    })

    socket.on('disconnect', () => {
        io.emit('user left', 'User has left')
    })

})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
