const express = require('express')
const router = express.Router()
const validateUserDetails = require('../middleware/validateUserDetails')
const verifyUser = require('../middleware/verifyUser')
const jwtGenerator = require('../middleware/jwtGenerator')
const checkUser = require('../middleware/checkUser')
const hashPassword = require('../middleware/hashPassword')
const authorize = require('../middleware/authorize')
const createUser = require('../middleware/createUser')
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

router.post('/signup', validateUserDetails, checkUser, hashPassword, createUser, jwtGenerator,  async (req, res) => {
    const {token} = req.body
    try {
        res.cookie('token', token, {httpOnly: true, expires: dayjs().add(7, 'days').toDate()})
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/authorized', authorize, (req, res) => {
    res.json({username: req.username, user_id: req.user_id})
})

router.get('/data', authorize, async (req, res) => {
    const user_id = req.user_id;
    const friendsData = await db.query('SELECT username FROM friend_requests AS f, ' +
        'users AS u WHERE CASE WHEN f.sender_id = $1 AND f.request_status = $2 ' +
        'THEN f.receiver_id = u.user_id WHEN f.receiver_id = $3 AND f.request_status = $4 ' +
        'THEN f.sender_id = u.user_id END', [user_id, 'accepted', user_id, 'accepted'])

    const messagesData = await db.query('SELECT username as friend, message, CASE WHEN m.sender_id = $1 THEN \'sent\' WHEN m.recipient_id = $2 THEN \'received\' END AS type ' +
        'FROM users AS u, messages AS m WHERE CASE WHEN m.sender_id = $3 THEN m.recipient_id = u.user_id WHEN m.recipient_id = $4 THEN m.sender_id = u.user_id END ORDER BY m.date',
        [user_id, user_id, user_id, user_id])


    const pendingFriendRequestsData = await db.query('SELECT username as sender_username FROM users AS u, friend_requests AS f WHERE ' +
        'CASE WHEN f.receiver_id = $1 AND f.request_status = $2 THEN f.sender_id = u.user_id END', [user_id, 'pending'])

    const friends = await Promise.all(friendsData.rows.map(async d => {
        const friend = {}
        friend['friend'] = d.username
        const online = await redis.get(d.username.toLowerCase())
        if (online) friend['status'] = 1
        else friend['status'] = 0
        return friend
    }))

    /*res.json({friends, messages, pendingFriendRequests})*/
    res.json({friends, messages: messagesData.rows, pendingFriendRequests: pendingFriendRequestsData.rows})
})

module.exports = router
