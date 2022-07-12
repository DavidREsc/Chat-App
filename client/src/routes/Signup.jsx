import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import SignupForm from '../components/signup/SignupForm'
import LoginLink from '../components/signup/LoginLink'
import User from '../apis/User'
import '../styles/signup.css'

const Signup = () => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const onSubmitHandler = async (data) => {
    setLoading(true)
    const {username, email, password, confirmPassword} = data
    try {
      const response = await User.post('/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        username,
        email,
        password,
        confirmPassword
      })
      const id = response.data.user_id
      navigate(`/user/verify/${id}`, {replace: true})  
    } catch (e) {
        setError(e.response.data.error)
        setLoading(false)
    }
  }
  return (
    <div className='signup-page'>
      <div className='signup-form-container'>
        <SignupForm onSubmitHandler={onSubmitHandler} error={error} loading={loading}/>
        <LoginLink />
      </div>
    </div>
  )
}

export default Signup