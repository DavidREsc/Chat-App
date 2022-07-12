const db = require('../db')
const friendRequest = async (io, socket, redis, username, callback) => {
    // retrieve receiver account entry
    try {
        const sender = socket.handshake.auth.user
        // Check if sending request to self
        if (username === sender) return callback("Unable to send friend request to yourself")

        const user = await db.query('SELECT * FROM users WHERE username = $1', [username])
        // check if user exists
        if (!user.rows.length) {
            return callback('User does not exist')
        }
        // check if request already made
        const request = await db.query('SELECT * FROM friend_requests WHERE sender_username = $1 AND receiver_username = $2', [sender, username])
        if (request.rows.length) return callback('You\'ve already sent a request to this user')

        // store request in database
        await db.query('INSERT INTO friend_requests (sender_username, receiver_username) ' +
            'VALUES ($1, $2)', [sender, username])

        // fetch socketId of receiver
        const receiverId = await redis.get(username)


        // send request to receiver
        io.to(receiverId).emit('receive-friend-request', sender)
        callback()
    } catch (e) {
        console.log(e)
        callback('Server error. Please try again later')
    }
}

module.exports = friendRequest