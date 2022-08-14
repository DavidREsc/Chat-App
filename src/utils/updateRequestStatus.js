const db = require('../db')

// receiver accepting/declining friend request from sender
const updateRequestStatus = async (sender, status, socket, io, redis) => {
    try {
        // Get sender's user id
        const user = await db.query('SELECT * FROM users WHERE username = $1', [sender])
        const senderId = user.rows[0].user_id
        // Get receiver's username and id from socket
        const receiver = socket.handshake.auth.user.username
        const receiverId = socket.handshake.auth.user.user_id

        // Update friend request status to accepted or declined
        const request = await db.query('UPDATE friend_requests SET request_status = $1 ' +
                'WHERE sender_id = $2 AND receiver_id = $3 RETURNING *', [status, senderId, receiverId])

        // friend request accepted     
        if (request.rows[0].request_status === 'accepted') { 
            // Get sender's socket id
            const friendId = await redis.get(sender.toLowerCase())
            // Create object of sender's (now a friend) username and online status. If sender's socketid not retrieved from
            // Redis then sender is offline
            let newFriend = {friend: sender, status: friendId ? 1 : 0}
            // emit to receiver that sender is now a friend and send the newfriend object 
            socket.emit('accepted-friend-request', newFriend, 'accepted')
            // emit to sender that receiver is now a friend and send newfriend object with sender's info
            newFriend = {friend: receiver, status: 1}
            io.to(friendId).emit('accepted-friend-request', newFriend)

        // request declined
        } else {
            socket.emit('declined-friend-request', sender, 'declined')
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = updateRequestStatus
