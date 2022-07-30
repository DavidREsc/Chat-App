import React from 'react'
import { useSocket } from '../../contexts/Socket'

const PendingFriendRequestContainer = (props) => {
  const {request} = props
  const {socket} = useSocket()
  return (
    <li className='pending-friend-request-container'>
      <p style={{fontSize: '1.1em'}}>{request.sender_username}</p>
      <span>
        <button 
          onClick={() => socket.emit('update-request-status', request.sender_username, 'accepted')}
          style={{color: 'green'}} 
          className='request-toast-btn'>
          Accept
        </button>
        <button 
          onClick={() => socket.emit('update-request-status', request.sender_username, 'declined')}
          style={{color: 'red', marginLeft: '20px'}} 
          className='request-toast-btn'>
          Decline
        </button>
      </span>
    </li>
  )
}

export default PendingFriendRequestContainer