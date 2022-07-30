import React from 'react'
import ChatMessage from './ChatMessage'

const ChatDisplay = (props) => {
    const {messages, selectedFriend} = props
  return (
    <div className='chat-display'>
        {messages && messages.filter(message => message.friend === selectedFriend).map((m, idx) => {
            return (
                  <ChatMessage key={idx} message={m} selectedFriend={selectedFriend}/>
            )
        })}
    </div>
  )
}

export default ChatDisplay