import React from 'react'

const ChatMessages = (props) => {
    const {message} = props
    const sentStyle = {
      alignSelf: 'flex-end',
      backgroundColor: '#0063d1',
      color: 'white'
    }
    const receivedStyle = {
      alignSelf: 'flex-start',
      backgroundColor: 'white'
    }
  return (
    <div className='chat-message' style={message.type === 'sent' ? sentStyle : receivedStyle}>
        {message.message}
    </div>
  )
}

export default ChatMessages