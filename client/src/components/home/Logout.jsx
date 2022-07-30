import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Button} from '@chakra-ui/react'
import User from '../../apis/User'
import { useSocket } from '../../contexts/Socket'

const Logout = () => {
  const {socket} = useSocket()
  const navigate = useNavigate()
  const logoutHandler = async () => {
    try {
        await User.post('/logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
        navigate('/login', {replace: true})
    } catch (e) {
        console.log(e)
    }
  }

  return (
    <Button colorScheme='red' onClick={logoutHandler} m='4'>Log Out</Button>
  )
}

export default Logout