import React, {useState} from 'react'
import SendLinkBtn from '../components/verify/SendLinkBtn'
import {Heading} from '@chakra-ui/react'
import '../styles/verify.css'

const Verify = () => {
  const [loading, setLoading] = useState(false)

  const sendLink = () => {
    setLoading(true)
    setTimeout(() => {
        setLoading(false)
    }, 1000)
  }
  return (
    <div className='verify-page'>
        <Heading size='lg' m ='4'>Thank you for signing up!</Heading>
        <p>
            Please click the button below to send a link to your email and verify your account
        </p>
        <SendLinkBtn loading={loading} sendLink={sendLink}/>

    </div>
  )
}

export default Verify