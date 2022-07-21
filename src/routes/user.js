const express = require('express')
const router = express.Router()
const validateUserDetails = require('../middleware/validateUserDetails')
const verifyUser = require('../middleware/verifyUser')
const jwtGenerator = require('../middleware/jwtGenerator')
const checkUser = require('../middleware/checkUser')
const hashPassword = require('../middleware/hashPassword')
const authorize = require('../middleware/authorize')
const dayjs = require('dayjs')
const db = require('../db')
const Redis = require('ioredis')
const redis = new Redis()

router.post('/login', validateUserDetails, verifyUser, jwtGenerator, async (req, res) => {
    const {token} = req.body
    try {
        res.cookie('token', token, {httpOnly: true, expires: dayjs().add(7, 'days').toDate()})
        res.json({username: req.body.username, id: req.body.id})
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/signup', validateUserDetails, checkUser, hashPassword,  async (req, res) => {
    const {username, email, password} = req.body
    try {
        const user = await db.query(
            'INSERT INTO users (username, email, password) ' +
            'VALUES ($1, $2, $3) RETURNING *', [username, email, password]
        )
        res.json({user_id: user.rows[0].user_id})
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/authorized', authorize, (req, res) => {
    res.json({username: req.username, user_id: req.user_id})
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
    res.json({friends, messages})
})

module.exports = router
