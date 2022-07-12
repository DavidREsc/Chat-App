const jwt = require('jsonwebtoken')
require('dotenv').config()

const authorize = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({"error": "You are not authorized to view this page"})
    try {
        const verified = jwt.verify(token, process.env.JWTSECRET)
        req.username = verified.username
        req.user_id = verified.user_id
        next()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = authorize