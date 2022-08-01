const updateConnectionStatus = async (friends, socket, io, redis, status) => {
    const username = socket.handshake.auth.user.username
    if (friends) {
        try {
            for (let friend of friends) {   
                const friendId = await redis.get(friend.friend.toLowerCase())
                if (friendId) io.to(friendId).emit('friend-connection-status', status, username)
            }
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = updateConnectionStatus