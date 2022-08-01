const db = require('../db')
const friendRequest = async (io, socket, redis, username, callback) => {
    // retrieve receiver account entry
    try {
        const sender = socket.handshake.auth.user.username
        const senderId = socket.handshake.auth.user.user_id
        // Check if sending request to self
        if (username.toLowerCase() === sender.toLowerCase()) return callback("Unable to send friend request to yourself")

        const user = await db.query('SELECT * FROM users WHERE username ILIKE $1', [username])
        // check if user exists
        if (!user.rows.length) {
            return callback('User does not exist')
        }
        const user_id = user.rows[0].user_id
        
        // check if request already made
        const request = await db.query('SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2', [senderId, user_id])
        if (request.rows.length && request.rows[0].request_status !== 'accepted') return callback('You\'ve already sent a request to this user')
        if (request.rows.length && request.rows[0].request_status === 'accepted') return callback('This user is already your friend')

        const friend = await db.query('SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2', [user_id, senderId])
        if (friend.rows.length && friend.rows[0].request_status === 'accepted') return callback('This user is already your friend')

        // store request in database
        await db.query('INSERT INTO friend_requests (sender_id, receiver_id) ' +
            'VALUES ($1, $2)', [senderId, user_id])

        // fetch socketId of receiver
        const receiverId = await redis.get(username.toLowerCase())

        // send request to receiver
        io.to(receiverId).emit('receive-friend-request', sender)
        callback()
    } catch (e) {
        console.log(e)
        callback('Server error. Please try again later')
    }
}

module.exports = friendRequest