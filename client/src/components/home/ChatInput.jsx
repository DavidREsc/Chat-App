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
          <FormControl>
            <Input 
              variant='filled'
              ref={$messageFormInput}
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoFocus
              autoComplete='off'
            />
            <Button type='submit' ref={$messageFormButton}>Send</Button>
          </FormControl>
        </form>
    </div>
  )
}

export default ChatForm