import React, {useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SignupForm from '../components/signup/SignupForm'
import LoginLink from '../components/signup/LoginLink'
import User from '../apis/User'
import '../styles/signup.css'

const Signup = () => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const prevLocation = location.state?.prev?.pathname || "/"

  const onSubmitHandler = async (data) => {
    setLoading(true)
    const {username, email, password, confirmPassword} = data
    try {
      await User.post('/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        username,
        email,
        password,
        confirmPassword
      })
      navigate(prevLocation, {replace: true})
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