const db = require('../db')

// Checks if user email already in use
const checkUser = async (req, res, next) => {
    const {email} = req.body
    try {
        const user = await db.query('SELECT * FROM users WHERE user = $1', [email])
        if (user.rows.length) return res.status(409).send('User with that email already exists')
        next()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = checkUser
