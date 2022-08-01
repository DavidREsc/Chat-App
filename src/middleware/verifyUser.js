const db = require('../db')
const bcrypt = require('bcrypt')

// Verify user email and password
const verifyUser = async (req, res, next) => {
    const {email, password} = req.body
    try {
        
        const user = await db.query('SELECT * FROM users WHERE email ILIKE $1', [email])
        // Check if user exists
        if (!user.rows.length) return res.status(404).json({"error": {"email": "User with this email does not exist"}})
        const passwordMatch = await bcrypt.compare(password, user.rows[0].password)
        // Check if password matches
        if (!passwordMatch) return res.status(404).send({"error": {"password": "Password is incorrect"}})
        req.body.username = user.rows[0].username
        req.body.user_id = user.rows[0].user_id
        next()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = verifyUser