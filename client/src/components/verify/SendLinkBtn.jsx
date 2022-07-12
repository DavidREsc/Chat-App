import React from 'react'
import {Button} from '@chakra-ui/react'
import {BiMailSend} from 'react-icons/bi'

const SendLinkBtn = (props) => {
    const {loading, sendLink} = props
  return (
    <Button
        size='lg'
        colorScheme='red'
        rightIcon={<BiMailSend style={{fontSize: '1.5em'}}/>}
        isLoading={loading ? true : false}
        loadingText='Sending'
        m='10'
        onClick={sendLink}>
        Send Link
    </Button>
  )
}

export default SendLinkBtn