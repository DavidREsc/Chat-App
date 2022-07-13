import React from 'react'

const ChatMessages = (props) => {
    const {message} = props
  return (
    <div className='chat-message'>
        {message}
    </div>
  )
}

export default ChatMessages