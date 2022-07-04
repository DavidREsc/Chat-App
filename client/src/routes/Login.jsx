import React from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import { useAuth } from '../contexts/Auth'
import LoginForm from '../components/login/LoginForm'
import SignupLink from '../components/login/SignupLink'

const Login = (props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const {login} = useAuth()
    const prevLocation = location.state?.prev?.pathname || "/"

    const handleSubmit = async (e, data) => {
        e.preventDefault()
        try {
            await login(data)
            navigate(prevLocation, {replace: true})
        } catch (e) {
            console.log(e.message)
        }
    }
  return (
    <div>
        <LoginForm handleSubmit={handleSubmit}/>
        <SignupLink/>
    </div>
  )
}

export default Login