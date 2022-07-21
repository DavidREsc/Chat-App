const db = require('../db')

const sendMessage = async (message, recipient, socket, io, redis) => {
    try {
        const sender = socket.handshake.auth.user;
        await db.query('INSERT INTO messages (message, sender_username, recipient_username, date) ' +
            'VALUES ($1, $2, $3, to_timestamp($4))', [message, sender, recipient, Date.now() / 1000.0])

        const recipientId = await redis.get(recipient)
        io.to(recipientId).emit('receive-message', message, sender)
    } catch (error) {
        console.log(error)
    }
   
}

module.exports = sendMessage
