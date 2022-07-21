import React, {useState} from 'react'
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSocket } from '../../contexts/Socket'
import SendFriendRequestForm from './SendFriendRequestForm';

const SendFriendRequest = () => {
  
  const {socket} = useSocket()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const sendFriendRequest = (userId) => {
    if (userId === "") setError('Please enter a username')
    else {
      setLoading(true)
      socket.emit('friend-request', userId, (err) => {
        if (err) setError(err)
        else {
          toast.success(`Friend request sent to ${userId}!`, {
            containerId: 'B',
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
        setLoading(false)
      })
    }
  }

  const reset = () => {
    setError("")
  }
  return (
    <>
      <SendFriendRequestForm sendFriendRequest={sendFriendRequest} error={error} loading={loading} reset={reset}/>
      <ToastContainer
        enableMultiContainer containerId={'B'}
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={Flip}
      />
    </>
  )
}

export default SendFriendRequest