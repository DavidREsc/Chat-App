import React, {useState, useContext, createContext, useEffect} from 'react'
import {Navigate, useLocation} from 'react-router-dom'
import User from '../apis/User'
import { Spinner } from '@chakra-ui/react'

const AuthContext = createContext()
export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {

    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState(false)
    const [loading, setLoading] = useState(true)
    const location = useLocation()

    useEffect(() => {
        const isAuthorized = async () => {
            try {
                const response = await User.post('/authorized', {
                    method: 'POST'
                })
                setIsAuth(true)
                login(response.data)
            } catch (error) {

            }
            setLoading(false)
        }
        isAuthorized()
    },[])

    const login = async (user) => {
        setUser(user) 
    }

    const logout = async () => {
        setUser(false)
    }

    const value = {
        login,
        logout,
        user,
        isAuth
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading ? 
                isAuth ? children : <Navigate to='/login' state={{prev: location}} replace />
            : <div className='loading-page'>
                <Spinner 
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                /> 
              </div>
            }
        </AuthContext.Provider>
    )
}