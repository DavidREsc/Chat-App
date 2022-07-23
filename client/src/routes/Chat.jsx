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
import PendingFriendRequests from '../components/home/PendingFriendRequests'

const Chat = () => {

  const [messages, setMessages] = useState([])
  const [friendList, setFriendList] = useState([])
  const [pendingFriendRequests, setPendingFriendRequests] = useState([])
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
      console.log(message)
      setMessages(prev => [...prev, {
        message,
        friend,
        "type": "received"
      }])
    })
    socket.on('user joined', (user) => console.log(user))
    socket.on('accepted-friend-request', (friend, status) => {
      setFriendList(prev => prev.concat(friend))
      if (!friendList.length) setSelectedFriend(friend.friend)
      const updatePendingFriendRequests = pendingFriendRequests.filter(r => r.sender_username !== friend.friend)
      setPendingFriendRequests(updatePendingFriendRequests)
    })
    socket.on('declined-friend-request', (friend) => {
      const updatePendingFriendRequests = pendingFriendRequests.filter(r => r.sender_username !== friend)
      setPendingFriendRequests(updatePendingFriendRequests)
    })
    socket.on('friend-connection-status', (status, username) => {
      let copy = friendList.slice()
      for (let friend of copy) {
        if (friend.friend === username) friend.status = status
      }
      setFriendList(copy)
      console.log('what')
    })
    
    return () => {
      socket.off('welcome message')
      socket.off('receive-message')
      socket.off('user joined')
      socket.off('accepted-friend-request')
      socket.off('declined-friend-request')
      socket.off('friend-connection-status')
    }
  },[socket, friendList, pendingFriendRequests])

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await User.get('/data', {
          method: 'GET'
        })
        console.log(data.data)
        setFriendList(data.data.friends)
        setSelectedFriend(data.data.friends[0]?.friend || null)
        setMessages(data.data.messages)
        setPendingFriendRequests(data.data.pendingFriendRequests)
        setLoading(false)
        socket.emit('connection-status', data.data.friends, 1)
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
          <PendingFriendRequests pendingFriendRequests={pendingFriendRequests}/>
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
        <ReceiveFriendRequest addPendingFriendRequest={(from) => 
          setPendingFriendRequests(prev => prev.concat({sender_username: from}))}/>
      </div>
    
  )
}

export default Chat
