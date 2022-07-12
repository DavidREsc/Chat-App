import React from 'react'
import {Link} from 'react-router-dom'
import {Box} from '@chakra-ui/react'

const LoginLink = () => {
  return (
    <Box ml='2' mb='1' color='#00008b' _hover={{color: '#1f51ff'}} display='inline-block'>
      <Link to='/login' style={{fontSize: '0.9em'}}>Already have an account? Click here to login</Link>
    </Box>
  )
}

export default LoginLink