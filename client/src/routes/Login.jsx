import React, {useState} from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import LoginForm from '../components/login/LoginForm'
import SignupLink from '../components/login/SignupLink'
import '../styles/login.css'
import User from '../apis/User'

const Login = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const prevLocation = location.state?.prev?.pathname || "/"
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [loadingD1, setLoadingD1] = useState(false)
    const [loadingD2, setLoadingD2] = useState(false)

    const onSubmitHandler = async (data, demoLoad) => {
        if (demoLoad === 'd1')setLoadingD1(true)
        else if (demoLoad === 'd2') setLoadingD2(true)
        else setLoading(true)
        const {email, password} = data
        try {  
            await User.post('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                email,
                password
            })
            navigate(prevLocation, {replace: true})
        } catch (e) {
            setLoading(false)
            setError(e.response.data.error)
        }
    }
  return (
    <div className='login-page'>
        <div className='login-form-container'>
            <LoginForm onSubmitHandler={onSubmitHandler} error={error} loading={loading} loadingD1={loadingD1} loadingD2={loadingD2}/>
            <SignupLink/>
        </div>
        
    </div>
  )
}

export default Login