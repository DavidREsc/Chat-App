const jwt = require('jsonwebtoken')
const db = require('../db')
require('dotenv').config()

const authorize = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({"error": "You are not authorized"})
    try {
        const blackListedToken = await db.query('SELECT token FROM JwtBlacklist ' + 
            'WHERE token = $1', [token])
        if (blackListedToken.rows.length) return res.status(401).json({"error": "You are not authorized"})
        const verified = jwt.verify(token, process.env.JWTSECRET)
        req.username = verified.username
        req.user_id = verified.user_id
        next()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = authorize