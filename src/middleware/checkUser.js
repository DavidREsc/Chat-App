const db = require('../db')

// Checks if user email already in use
const checkUser = async (req, res, next) => {
    const {email, username} = req.body
    try {
        const userEmail = await db.query('SELECT * FROM users WHERE email = $1', [email])
        if (userEmail.rows.length) return res.status(409).json({"error": {"email": "Account with that email already exists"}})
        const userUsername = await db.query('SELECT * FROM users WHERE username = $1', [username])
        if (userUsername.rows.length) return res.status(409).json({"error": {"username": "Account with that username already exists"}})
        next()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = checkUser
