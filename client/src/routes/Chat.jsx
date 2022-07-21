import React, {useEffect, useState} from 'react'
import ChatInput from '../components/home/ChatInput'
import ChatDisplay from '../components/home/ChatDisplay'
import SendFriendRequest from '../components/home/SendFriendRequest'
import ReceiveFriendRequest from '../components/home/ReceiveFriendRequest'
import FriendList from '../components/home/FriendList'
import User from '../apis/User'
import 'react-toastify/dist/ReactToastify.css';
import {useSocket} from '../contexts/Socket'
import '../styles/chat.css'
import { Spinner } from '@chakra-ui/react'

const Chat = () => {

  const [messages, setMessages] = useState([])
  const [friendList, setFriendList] = useState([])
  const [selectedFriend, setSelectedFriend] = useState("")
  const [loading, setLoading] = useState(true)
  const {socket} = useSocket()

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Successfully connected")
    })
    socket.on('welcome message', (m) => {
      console.log(m)
    })
    console.log("chat")
    socket.on('receive-message', (message, friend) => {
      setMessages(prev => [...prev, {
        message,
        friend,
        "type": "received"
      }])
    })
    socket.on('user joined', (user) => console.log(user))
    socket.on('accepted-friend-request', (friend) => {
      setFriendList(prev => prev.concat(friend))
    })
    
    return () => {
      socket.off('welcome message')
      socket.off('message')
      socket.off('user joined')
      socket.off('accepted-friend-request')
      socket.disconnect(["yo"])
    }
  },[socket])

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await User.get('/data', {
          method: 'GET'
        })
        console.log(data.data.friends)
        setFriendList(data.data.friends)
        setSelectedFriend(data.data.friends[0].friend)
        setMessages(data.data.messages)
        setLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  },[socket])

  const sendMessage = (message, callback) => {
    socket.emit('send message', message, selectedFriend, () => {
      setMessages(prev => [...prev, {
        message,
        "friend": selectedFriend,
        "type": "sent"
      }])
      callback()
    })
  }

  return (
    loading ? 
      <div className='loading-page'>
        <Spinner 
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      </div> 
    :
      <div className='chat-page'>
        <div className='menu-section'>
          <span>Friend Requests</span>
          <span>Log Out</span>
        </div>
        <div className='friend-section'>
          <SendFriendRequest/>
          <FriendList friendList={friendList} selectFriend={(friend) => setSelectedFriend(friend)}/>
        </div>
        <div className='chat-section'>
          <div className='chat-display-container'>
            <ChatDisplay messages={messages} selectedFriend={selectedFriend}/>
          </div>
          <ChatInput sendMessage={sendMessage}/>
        </div>
        <ReceiveFriendRequest/>
      </div>
    
  )
}

export default Chat
