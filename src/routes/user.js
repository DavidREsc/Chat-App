const express = require('express')
const router = express.Router()
const validateUserDetails = require('../middleware/validateUserDetails')
const verifyUser = require('../middleware/verifyUser')
const jwtGenerator = require('../middleware/jwtGenerator')
const checkUser = require('../middleware/checkUser')
const hashPassword = require('../middleware/hashPassword')
const authorize = require('../middleware/authorize')
const db = require('../db')

router.post('/login', validateUserDetails, verifyUser, jwtGenerator, async (req, res) => {
    const {token} = req.body
    try {
        res.cookie('token', token, {httpOnly: true})
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

module.exports = router
