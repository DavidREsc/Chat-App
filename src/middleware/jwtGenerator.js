const jwt = require('jsonwebtoken')

// Generates a jwt token with user id
const jwtGenerator = async (req, res, next) => {
    try {
        const payload = {username: req.body.username, user_id: req.body.user_id}
        const secret = process.env.JWTSECRET
        const token = await jwt.sign(payload, secret, {expiresIn: '7d'})
        req.body.token = token
        next()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = jwtGenerator
