const express = require('express')
const router = express.Router()
const validateUserDetails = require('../middleware/validateUserDetails')
const verifyUser = require('../middleware/verifyUser')
const jwtGenerator = require('../middleware/jwtGenerator')
const checkUser = require('../middleware/checkUser')
const hashPassword = require('../middleware/hashPassword')
const authorize = require('../middleware/authorize')
const sgMail = require('@sendgrid/mail')
const dayjs = require('dayjs')
const db = require('../db')
require('dotenv').config()
const Redis = require('ioredis')
const redis = new Redis(process.env.NODE_ENV === 'production' ? process.env.REDIS_URL : {
    'port': 6379,
    'host': '127.0.0.1'
})

router.post('/login', validateUserDetails, verifyUser, jwtGenerator, async (req, res) => {
    const {token} = req.body
    try {
        res.cookie('token', token, {httpOnly: true, expires: dayjs().add(7, 'days').toDate()})
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logout', authorize, async (req, res) => {
    const token = req.cookies.token
    try {
        await db.query('INSERT INTO JwtBlacklist (token) ' +
            'VALUES ($1) RETURNING *', [token])
        res.cookie('token', 'none', {expires: new Date(1), httpOnly: true})
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/signup', validateUserDetails, checkUser, hashPassword, jwtGenerator,  async (req, res) => {
    const {username, email, password, token} = req.body
    try {
        const user = await db.query(
            'INSERT INTO users (username, email, password) ' +
            'VALUES ($1, $2, $3) RETURNING *', [username, email, password]
        )
        res.cookie('token', token, {httpOnly: true, expires: dayjs().add(7, 'days').toDate()})
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/authorized', authorize, (req, res) => {
    res.json({username: req.username})
})

router.get('/data', authorize, async (req, res) => {
    const username = req.username;
    const friendsData = await db.query('SELECT sender_username, receiver_username ' +
        'FROM friend_requests WHERE receiver_username = $1 AND request_status = $2 ' +
        'OR sender_username = $3 AND request_status = $4',
        [username, 'accepted', username, 'accepted'])

    const messagesData = await db.query('SELECT sender_username, recipient_username, message ' +
        'FROM users INNER JOIN messages ON messages.sender_username = users.username ' +
        'OR messages.recipient_username = users.username WHERE users.username = $1 ORDER BY messages.date',
        [username])

    const pendingFriendRequestsData = await db.query('SELECT sender_username FROM friend_requests ' +
        'WHERE receiver_username = $1 AND request_status = $2', [username, 'pending'])

    const friends = await Promise.all(friendsData.rows.map(async d => {
        const friend = {}
        if (d.sender_username !== username) friend['friend'] = d.sender_username
        else friend['friend'] = d.receiver_username
        const online = await redis.get(friend.friend)
        if (online) friend['status'] = 1
        else friend['status'] = 0
        return friend
    }))
    const messages = messagesData.rows.map(message => {
        return {
            "message": message.message,
            "friend": message.sender_username !== username ?
                      message.sender_username : message.recipient_username,
            "type": message.sender_username === username ? "sent" : "received"
        }
    })
    const pendingFriendRequests = pendingFriendRequestsData.rows
    res.json({friends, messages, pendingFriendRequests})
})

module.exports = router
