const db = require('../db')

const createUser = async (req, res, next) => {
    const {username, email, password} = req.body
    try {
        const user = await db.query(
            'INSERT INTO users (username, email, password) ' +
            'VALUES ($1, $2, $3) RETURNING *', [username, email, password]
        )
        req.body.user_id = user.rows[0].user_id
        next()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

module.exports = createUser
