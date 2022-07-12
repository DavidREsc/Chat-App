import React, {useState} from 'react'
import { 
  Button,
  Input,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSocket } from '../../contexts/Socket'

const AddFriend = () => {
  const [userId, setUserId] = useState("")
  const [error, setError] = useState("")
  const {socket} = useSocket()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (userId === "") setError("Please enter a username")
    else {
      setError("")
      sendFriendRequest()
      setUserId("")
    }
  }

  const sendFriendRequest = () => {
    socket.emit('friend-request', userId, (err) => {
      if (err) setError(err)
      else {
        toast.success(`Friend request sent to ${userId}!`, {
          containerId: 'B',
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
    })
  }
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <FormControl isInvalid={error}>
          <Input
            variant="filled"
            placeholder="Enter username or email"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}>
          </Input>
          {error && 
            <FormErrorMessage>
              {error}
            </FormErrorMessage>
          }
          <Button 
            type='submit'
            colorScheme='messenger'
            variant='link'>
            Send friend request
          </Button>
        </FormControl>
      </form>
      <ToastContainer
        enableMultiContainer containerId={'B'}
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={Flip}
      />
    </div>
  )
}

export default AddFriend