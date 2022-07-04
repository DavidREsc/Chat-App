import React from 'react'
import SignupForm from '../components/signup/SignupForm'
import { useAuth } from '../contexts/Auth'

const Signup = () => {
    const {signup} = useAuth()
    const handleSubmit = async (e, data) => {
        e.preventDefault()
        try {
           await signup(data)
        } catch (e) {
            console.log(e.message)
        }
    }
  return (
    <div>
        <SignupForm handleSubmit={handleSubmit}/>
    </div>
  )
}

export default Signup