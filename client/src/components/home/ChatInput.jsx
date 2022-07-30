import React, {useRef} from 'react'
import * as yup from 'yup'
import { Input, Button, FormControl, FormErrorMessage } from '@chakra-ui/react'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
const schema = yup.object().shape({
  message: yup.string()
    .min(1, 'Type something')
    .max(500, "Message must be 500 characters or less")
})

const ChatForm = (props) => {
    const {sendMessage, selectedFriend} = props
    const $messageFormButton = useRef(null)

  

    const onSubmitHandler = (data) => {
        const {message} = data
        $messageFormButton.current.setAttribute('disabled', 'disabled')
        sendMessage(message, () => {
            $messageFormButton.current.removeAttribute('disabled')
            reset()
        })
    }

    const onError = (errors, e) => console.log(errors, e)

    const {register, handleSubmit, reset, formState: {errors}} = useForm({
      resolver: yupResolver(schema)
    })
  return (
    <div>
        <form onSubmit={handleSubmit(onSubmitHandler, onError)}>
          <FormControl p='4' width='75%' display='flex' justifyContent='center' mb='10' ml='4'
            isInvalid={!!errors?.message?.message} 
          >
            <Input 
              {...register('message')}
              background='white'
              variant='outline'
              autoFocus
              autoComplete='off'
              size='lg'
              borderRadius='20'
              disabled={selectedFriend ? false : true}
            >
            </Input>
            <FormErrorMessage>
              {errors?.message?.message}
            </FormErrorMessage>
            <Button disabled={selectedFriend ? false : true} size='lg' width='20%' ml='5' colorScheme='messenger' type='submit' ref={$messageFormButton}>Send</Button>
          </FormControl>      
        </form>
    </div>
  )
}

export default ChatForm