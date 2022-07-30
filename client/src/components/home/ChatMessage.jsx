import React from 'react'
import UserAvatar from './UserAvatar'
import { useAuth } from '../../contexts/Auth'

const ChatMessages = (props) => {
    const {message, selectedFriend} = props
    const {user} = useAuth()
    const sentStyleContainer = {
      alignSelf: 'flex-end'
    }
    const sentStyleMsg = {
      backgroundColor: '#0063d1',
      color: 'white'
    }
    const receivedStyleContainer = {
      alignSelf: 'flex-start'
    }
    const receivedStyleMsg = {
      backgroundColor: 'white'
    }
  return (
    
    <div className='chat-message-container' style={message.type === 'sent' ? sentStyleContainer : receivedStyleContainer} >
        {message.type === 'received' && <UserAvatar size='md' name={selectedFriend}/>}
        <span className='chat-message' style={message.type === 'sent' ? sentStyleMsg : receivedStyleMsg}>{message.message}</span>
        {message.type === 'sent' && <UserAvatar size='md' name={user.username} bg={'#0063D1'} color={'white'}/>}
    </div>
  )
}

export default ChatMessages