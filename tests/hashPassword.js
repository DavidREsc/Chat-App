const bcrypt = require('bcrypt')

// Hashes password before storing in db
const hashPassword = async (password) => {
    try {
        const saltRounds = 8
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = hashPassword