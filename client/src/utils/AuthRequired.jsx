import React, {Navigate, useLocation} from 'react-router-dom'
import {useState, useEffect} from 'react'
import { useAuth } from '../contexts/Auth'

export const AuthRequired = ({children}) => {
    const location = useLocation()
    const {isAuthorized, isAuth} = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log("auth")
        isAuthorized()
        setLoading(false)
    }, [isAuthorized])


    return (   
        !loading ? !isAuth ? <Navigate to='/login' state={{prev: location}} replace /> : children : null
    )
}