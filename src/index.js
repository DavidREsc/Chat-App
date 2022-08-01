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
const updateRequestStatus = require('./utils/updateRequestStatus')
const sendMessage = require('./utils/sendMessage')
const updateConnectionStatus = require('./utils/updateConnectionStatus')
const path = require('path');
const cors = require('cors');

const app = express()
// Create server and pass in the express app
const server = http.createServer(app)
// Initialize socketio and pass in the server
const io = socket(server)
const redis = new Redis(process.env.NODE_ENV === 'production' ? process.env.REDIS_URL : {
    'port': 6379,
    'host': '127.0.0.1'
})

app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/user', user)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')))
}

io.use(async (socket, next) => {
    const token = cookie.parse(socket.handshake.headers.cookie).token
    authorizeConnection(token, async (err, data) => {
        
        if (err) {       
            console.log(err)
            next(new Error(err))
        }
        else {
            try {
                const user = data
                const existing = await redis.get(user.username.toLowerCase())
                if (io.sockets.sockets.get(existing)) {
                    io.sockets.sockets.get(existing).disconnect()
                }
                socket.handshake.auth.user = user
                socket.handshake.query.friends = []
                const response = await redis.set(user.username.toLowerCase(), socket.id)  
                next()

            }
            catch (e) {
                console.log(e)
                next(new Error(e))
            }
        }
    })
})


io.on('connection', (socket) => {
    socket.on('send message', (message, recipient, callback) => {
        sendMessage(message, recipient, socket, io, redis)
        callback('Message delivered')
    })

    socket.on('friend-request', (username, callback) => {
        friendRequest(io, socket, redis, username, callback)
    })

    socket.on('update-request-status', (from, status) => {
        updateRequestStatus(from, status, socket, io, redis)
    })

    socket.on('connection-status', (friends, status) => {
        updateConnectionStatus(friends, socket, io, redis, status)
        socket.handshake.query.friends = friends
    })

    socket.on('add-new-friend', (friend) => {
        socket.handshake.query.friends.push(friend)
    })

    socket.on('disconnect', async () => {
        const username = socket.handshake.auth.user.username
        const friends = socket.handshake.query.friends
        updateConnectionStatus(friends, socket, io, redis, 0)
        try {
            await redis.del(username.toLowerCase())
        } catch (e) {
            console.log(e)
        }
    })

})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

server.listen(PORT, () => { 
    console.log(`Server listening on port ${PORT}`)
})
