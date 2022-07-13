import React from 'react'
import ChatMessage from './ChatMessage'

const ChatDisplay = (props) => {
    const {messages} = props
    const msg = [
      {text: 'Hey',
      from: 'sender'},
      {text: 'Hey, David?',
       from: 'receiver'},
      {text: 'Yeah its me =P',
       from: 'sender'}
    ]
  return (
    <div className='chat-display'>
        {messages && messages.map((m, idx) => {
            return (
                  <ChatMessage key={idx} message={m}/>
            )
        })}
    </div>
  )
}

export default ChatDisplay