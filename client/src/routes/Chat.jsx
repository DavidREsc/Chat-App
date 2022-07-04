import React, {useEffect, useState} from 'react'
import {io} from 'socket.io-client'
import ChatForm from '../components/home/ChatForm'
import ChatBox from '../components/home/ChatBox'
import ChatApi from '../apis/Chat'
const socket = io({
  autoConnect: false
})

const Chat = () => {

  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      console.log("Successfully connected")
    })
    socket.on('welcome message', (m) => {
      console.log(m)
    })
    socket.on('message', (message) => setMessages(prev => [...prev, message]))
    socket.on('user joined', (user) => console.log(user))
    return () => {
      socket.off('welcome message')
      socket.off('message')
      socket.off('user joined')
    }
  },[])

  const sendMessage = (message, callback) => {
    socket.emit('send message', message, () => {
      callback()
    })
  }

  return (
    <div>
      <ChatBox messages={messages} />
      <ChatForm sendMessage={sendMessage}/>
    </div>

  )
}

export default Chat
