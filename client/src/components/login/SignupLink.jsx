import React from 'react'
import { Link } from 'react-router-dom'
import {Box} from '@chakra-ui/react'

const SignupLink = () => {
  return (
    <Box mt='4' ml='2' mb='1' color='#00008b' _hover={{color: '#1f51ff'}} display='inline-block'>
      <Link to="/signup" style={{fontSize: '0.9em'}}>Sign up for an account</Link>
    </Box>
  )
}

export default SignupLink