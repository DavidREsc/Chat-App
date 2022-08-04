const v = require('validator')

const validateUserDetails = (req, res, next) => {
    let {username, email, password} = req.body
    
    if (username !== undefined) {
        if (v.isEmpty(username)) return res.status(400).json({"error": "Username not provided"})
        else if (username.length < 5 || username.length > 16) return res.status(400).json({"error": "Username must be between 5 and 16 characters"})
        username = v.escape(username)
        username = v.trim(username)
        req.body.username = username
    }
    if (email !== undefined) {
        if (v.isEmpty(email)) return res.status(400).json({"error": "Email not provided"})
        else if (!v.isEmail(email)) return res.status(400).json({"error": "Invalid email"})
        email = v.escape(email)
        email = v.trim(email)
        req.body.email = email
    }
    if (password !== undefined) {
        if (v.isEmpty(password)) return res.status(400).json({"error": "Password not provided"})
        else if (!v.isStrongPassword(password, {minLength: 8,
            minLowercase: 0,
            minUppercase: 0,
            minNumbers: 0,
            minSymbols: 0}) && req.originalUrl !== '/api/v1/user/login')
            return res.status(400).json({"error": "Password must be at least 8 characters long"})
        password = v.escape(password)
        password = v.trim(password)
        req.body.password = password
    }
    next()
}

module.exports = validateUserDetails
