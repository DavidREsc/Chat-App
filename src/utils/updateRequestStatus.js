const db = require('../db')

const updateRequestStatus = async (sender, status, receiver, socket, io, redis) => {
    console.log(sender, status, receiver)
    try {
        const request = await db.query('UPDATE friend_requests SET request_status = $1 ' +
                'WHERE sender_username = $2 AND receiver_username = $3 RETURNING *', [status, sender, receiver])

        if (request.rows[0].request_status === 'accepted') {
            const friend = request.rows[0].sender_username
            const friendId = await redis.get(friend)
            socket.emit('accepted-friend-request', friend)
            io.to(friendId).emit('accepted-friend-request', receiver)
        } else {
            console.log('declined')
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = updateRequestStatus
