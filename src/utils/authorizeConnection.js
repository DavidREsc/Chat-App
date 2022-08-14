const jwt = require('jsonwebtoken')
require('dotenv').config()

const authorizeConnection = (token, cb) => {
    // Jwt token not found
    if (!token) return cb('Authorization failed')
    try {
        // Verify token
        const verified = jwt.verify(token, process.env.JWTSECRET)
        cb(undefined, verified)
    } catch (e) {
        cb('Authorization failed')
    }
}

module.exports = authorizeConnection