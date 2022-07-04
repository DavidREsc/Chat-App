import React from 'react'

const ChatBox = (props) => {
    const {messages} = props
  return (
    <div>
        {messages && messages.map((msg, idx) => {
            return (
                <p key={idx}>{msg}</p>
            )
        })}
    </div>
  )
}

export default ChatBox