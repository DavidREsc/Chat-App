const v = require('validator')

const validateUserDetails = (req, res, next) => {
    let {firstName, lastName, email, password} = req.body
    if (firstName !== undefined) {
        if (v.isEmpty(firstName)) return res.status(400).json({"error": "First name not provided"})
        firstName = v.escape(firstName)
        firstName = v.trim(firstName)
        req.body.firstName = firstName
    }
    if (lastName !== undefined) {
        if (v.isEmpty(lastName)) return res.status(400).json({"error": "Last name not provided"})
        lastName = v.escape(lastName)
        lastName = v.trim(lastName)
        req.body.lastName = lastName
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
