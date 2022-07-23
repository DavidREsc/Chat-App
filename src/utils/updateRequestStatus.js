const db = require('../db')

const updateRequestStatus = async (sender, status, receiver, socket, io, redis) => {
    console.log(sender, status, receiver)
    try {
        const request = await db.query('UPDATE friend_requests SET request_status = $1 ' +
                'WHERE sender_username = $2 AND receiver_username = $3 RETURNING *', [status, sender, receiver])
        const friend = request.rows[0].sender_username
        if (request.rows[0].request_status === 'accepted') { 
            const friendId = await redis.get(friend)
            let newFriend = {friend, status: friendId ? 1 : 0}
            socket.emit('accepted-friend-request', newFriend, 'accepted')
            newFriend = {friend: receiver, status: 1}
            io.to(friendId).emit('accepted-friend-request', newFriend)
        } else {
            socket.emit('declined-friend-request', friend, 'declined')
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = updateRequestStatus
