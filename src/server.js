const express = require('express')
const http = require('http')
const socket = require('socket.io')
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
// Connect to Redis
const redis = new Redis(process.env.NODE_ENV === 'production' ? process.env.REDIS_URL : {
    'port': 6379,
    'host': '127.0.0.1'
})


app.use(cors());
// Parses json in the request body
app.use(express.json())
// Parses cookies
app.use(cookieParser())
// User routes
app.use('/api/v1/user', user)

// Use build files if in production mode
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')))
}

// Socket middleware
// Checks that user is authorized and stores socket id and username in Redis
io.use(async (socket, next) => {

    // Get jwt token and authorize user
    const token = cookie.parse(socket.handshake.headers.cookie).token
    authorizeConnection(token, async (err, data) => {
        
        // error authorizing
        if (err) {       
            console.log(err)
            next(new Error(err))
        }
        else {
            try {
                //Check is user is already connected
                const user = data
                const existing = await redis.get(user.username.toLowerCase())
                // if username already stored, user is connected concurrently. Disconnect previous connection
                if (io.sockets.sockets.get(existing)) {
                    io.sockets.sockets.get(existing).disconnect()
                }
                // attach username and user id to socket
                socket.handshake.auth.user = user
                socket.handshake.query.friends = []
                // Store username-socketid key value pair in Redis
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

// initialize socket
io.on('connection', (socket) => {

    // Listener for user sending a message to another user
    socket.on('send message', (message, recipient, callback) => {
        sendMessage(message, recipient, socket, io, redis)
        callback('Message delivered')
    })

    // Listener for user sending a friend request
    socket.on('friend-request', (username, callback) => {
        friendRequest(io, socket, redis, username, callback)
    })

    // Listener for the receiver accepting/declining a friend request from sender
    socket.on('update-request-status', (from, status) => {
        updateRequestStatus(from, status, socket, io, redis)
    })

    // Listener for emitting user's connection status after logging in
    socket.on('connection-status', (friends, status) => {
        updateConnectionStatus(friends, socket, io, redis, status)
        socket.handshake.query.friends = friends
    })

    //Listener for attaching a new friend's username to friend request sender's socket after friend request accepted
    socket.on('add-new-friend', (friend) => {
        socket.handshake.query.friends.push(friend)
    })

    // Listener for user disconnecting
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

module.exports = server