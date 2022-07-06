const express = require('express')
const http = require('http')
const socket = require('socket.io')
const PORT = process.env.PORT || 3001
const validateUserDetails = require('./middleware/validateUserDetails')
const verifyUser = require('./middleware/verifyUser')
const jwtGenerator = require('./middleware/jwtGenerator')
const checkUser = require('./middleware/checkUser')
const hashPassword = require('./middleware/hashPassword')
const authorize = require('./middleware/authorize')
const db = require('./db')
const cookieParser = require('cookie-parser')

const app = express()
// Create server and pass in the express app
const server = http.createServer(app)
// Initialize socketio and pass in the server
const io = socket(server)

app.use(express.json())
app.use(cookieParser())

app.post('/api/v1/user/login', validateUserDetails, verifyUser, jwtGenerator, async (req, res) => {
    const {token} = req.body
    try {
        res.cookie('token', token, {httpOnly: true})
        res.json(token)
    } catch (e) {
        res.status(500).send()
    }
})

app.post('/api/v1/user/signup', validateUserDetails, checkUser, hashPassword,  async (req, res) => {
    const {firstName, lastName, email, password} = req.body
    try {
        const user = await db.query(
            'INSERT INTO users (first_name, last_name, email, password) ' +
            'VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, email, password]
        )
        res.json(user.rows[0])
    } catch (e) {
        res.status(500).send()
    }
})

app.post('/api/v1/user/authorized', authorize, (req, res) => {
    res.json('verified')
})


io.on('connection', (socket) => {
    console.log("New connection")
    socket.emit('welcome message', 'Welcome!')
    socket.broadcast.emit('user joined', 'A new user has joined')

    socket.on('send message', (message, callback) => {
        
        io.emit('message', message)
        callback('Message delivered')
    })

    socket.on('disconnect', () => {
        io.emit('user left', 'User has left')
    })

})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
