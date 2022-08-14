const db = require('../db')

const sendMessage = async (message, recipient, socket, io, redis) => {
    try {
        // Get sender's username and id from socket
        const sender = socket.handshake.auth.user.username;
        const senderId = socket.handshake.auth.user.user_id

        // Get recipient's id from database
        const recipientData = await db.query('SELECT * FROM users WHERE username = $1', [recipient])
        const recipientId = recipientData.rows[0].user_id

        // Add message to database
        await db.query('INSERT INTO messages (message, sender_id, recipient_id, date) ' +
            'VALUES ($1, $2, $3, to_timestamp($4))', [message, senderId, recipientId, Date.now() / 1000.0])

        // Get recipient's socket id from Redis
        const recipientSocketId = await redis.get(recipient.toLowerCase())
        
        // Emit message to recipient
        io.to(recipientSocketId).emit('receive-message', message, sender)
    } catch (error) {
        console.log(error)
    }
   
}

module.exports = sendMessage
