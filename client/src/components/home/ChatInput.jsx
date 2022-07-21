import React, {useState, useRef} from 'react'
import { Input, Button, FormControl } from '@chakra-ui/react'

const ChatForm = (props) => {
    const {sendMessage} = props
    const [message, setMessage] = useState("")
    const $messageFormButton = useRef(null)
    const $messageFormInput= useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        const m = message
        setMessage("")
        $messageFormButton.current.setAttribute('disabled', 'disabled')
        $messageFormInput.current.focus()
        sendMessage(m, () => {
            $messageFormButton.current.removeAttribute('disabled')
        })
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
          <FormControl p='4' width='75%' display='flex' justifyContent='center' mb='10' ml='4'>
            <Input 
              background='white'
              variant='outline'
              ref={$messageFormInput}
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoFocus
              autoComplete='off'
              size='lg'
              borderRadius='20'
            />
            <Button size='lg' width='20%' ml='5' colorScheme='messenger' type='submit' ref={$messageFormButton}>Send</Button>
          </FormControl>
        </form>
    </div>
  )
}

export default ChatForm