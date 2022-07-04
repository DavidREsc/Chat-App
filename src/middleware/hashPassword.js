const bcrypt = require('bcrypt')

// Hashes password before storing in db
const hashPassword = async (req, res, next) => {
    const {password} = req.body
    try {
        const saltRounds = 8
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        next()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = hashPassword
