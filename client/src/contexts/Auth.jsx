import React, {useContext, createContext, useState, useEffect} from 'react'
import User from '../apis/User'

const AuthContext = createContext()
export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const isAuthorized = async () => {
            try {
                await User.post('/authorized', {
                    method: 'POST',
                })
                setUser(true)
            } catch (error) {
                setUser(false)
            }
            setLoading(false)
        }
        isAuthorized()
    },[])

    const login = async (data) => {
        const {email, password} = data
        try {
            const response = await User.post('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                email,
                password
            })
            console.log(response.data)
            setUser(true)
        } catch (e) {
            throw new Error(e.response.data.error)
        }
    }

    const signup = async (data) => {
        const {firstName, lastName, email, password} = data
        try {
            const response = await User.post('/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                firstName,
                lastName,
                email,
                password
            })
            console.log(response.data)
        } catch (e) {
            throw new Error(e.response.data.error)
        }
    }

    const value = {
        user,
        login,
        signup,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}