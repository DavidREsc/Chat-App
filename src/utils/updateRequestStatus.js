const db = require('../db')

const updateRequestStatus = async (sender, status, socket, io, redis) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE username = $1', [sender])
        const senderId = user.rows[0].user_id
        const receiver = socket.handshake.auth.user.username
        const receiverId = socket.handshake.auth.user.user_id
        const request = await db.query('UPDATE friend_requests SET request_status = $1 ' +
                'WHERE sender_id = $2 AND receiver_id = $3 RETURNING *', [status, senderId, receiverId])
        console.log(sender, senderId, receiver, receiverId)
        if (request.rows[0].request_status === 'accepted') { 
            const friendId = await redis.get(sender.toLowerCase())
            let newFriend = {friend: sender, status: friendId ? 1 : 0}
            socket.emit('accepted-friend-request', newFriend, 'accepted')
            newFriend = {friend: receiver, status: 1}
            io.to(friendId).emit('accepted-friend-request', newFriend)
        } else {
            socket.emit('declined-friend-request', sender, 'declined')
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = updateRequestStatus
