import React, {useEffect, useState, useRef} from 'react'
import ChatInput from '../components/home/ChatInput'
import ChatDisplay from '../components/home/ChatDisplay'
import AddFriend from '../components/home/AddFriend'
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { useAuth } from '../contexts/Auth'
import {useSocket} from '../contexts/Socket'
import '../styles/utils.css'
import '../styles/chat.css'

const Chat = () => {

  const [messages, setMessages] = useState([])
  //const {user} = useAuth()
  const {socket} = useSocket()
  const toastId = useRef(null)
 
  useEffect(() => {
    socket.on('connect', () => {
      console.log("Successfully connected")
    })
    socket.on('welcome message', (m) => {
      console.log(m)
    })
    console.log("chat")
    socket.on('message', (message) => setMessages(prev => [...prev, message]))
    socket.on('user joined', (user) => console.log(user))
    socket.on('receive-friend-request', (from) => {
      console.log("Received")
      toastId.current = toast.info(<span>
          <p>{from} wants to be your friend</p>
          <button style={{color: 'green', marginLeft: '35px'}} className='request-toast-btn' onClick={() => updateToast('accept')}>Accept</button>
          <button style={{color: 'red', margin: '10px 30px'}} className='request-toast-btn' onClick={() => updateToast('decline')}>Decline</button>
        </span>, {
        containerId: 'A',
        position: "top-center",
        closeOnClick: false,
        pauseOnHover: false,
        autoClose: 5000,
        hideProgressBar: false,
        progress: undefined,
        });
    })
    return () => {
      socket.off('welcome message')
      socket.off('message')
      socket.off('user joined')
    }
  },[socket])

  const sendMessage = (message, callback) => {
    socket.emit('send message', message, () => {
      callback()
    })
  }

  const updateToast = (status) => {
    if (status === 'accept') {
      toast.update(toastId.current, {
        render: "Accepted friend request",
        type: toast.TYPE.SUCCESS,
        autoClose: 2000
      })
    } else if (status === 'decline') {
      toast.update(toastId.current, {
        render: "Declined friend request",
        type: toast.TYPE.ERROR,
        autoClose: 2000
      })
    }
  }

  return (
    <div className='chat-page'>
      <div className='menu-section'>
        <AddFriend/>
      </div>
      <div className='chat-section'>
        <div className='chat-display-container'>
          <ChatDisplay messages={messages} />
        </div>
        <ChatInput sendMessage={sendMessage}/>
      </div>

        <ToastContainer
        enableMultiContainer containerId={'A'}
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        transition={Flip}
      />   
    </div>

  )
}

export default Chat
