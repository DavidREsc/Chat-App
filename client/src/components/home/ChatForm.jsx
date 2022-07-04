import React, {useState, useRef} from 'react'

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
            <input 
              ref={$messageFormInput}
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button ref={$messageFormButton}>Send</button>
        </form>
    </div>
  )
}

export default ChatForm