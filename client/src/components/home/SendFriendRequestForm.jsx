import React, {useState, useRef} from 'react'
import { 
    Button,
    Input,
    FormControl,
    FormErrorMessage,
    Heading,
    Center
  } from '@chakra-ui/react'

const SendFriendRequestForm = (props) => {
  const [userId, setUserId] = useState("")
  const {sendFriendRequest, error, loading, reset} = props
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    sendFriendRequest(userId)
    setUserId("")
    inputRef.current.focus()
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='friend-request-form'>
        <FormControl isInvalid={error}>
          <Center mb='3'>
            <Heading size='md'>Add a Friend</Heading>
          </Center>
          <Input
            ref={inputRef}
            autoComplete='off'
            variant="outline"
            colorScheme='red'
            placeholder="Enter a username"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onBlur={reset}>
          </Input>
          {error && 
            <FormErrorMessage>
              {error}
            </FormErrorMessage>
          }
          <Button 
            mt='4'
            type='submit'
            colorScheme='messenger'
            variant='solid'
            isLoading={loading ? true : false}
            loadingText='Sending'>
            Send friend request
          </Button>
        </FormControl>
      </form>
  )
}

export default SendFriendRequestForm