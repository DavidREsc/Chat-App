import React, {Navigate, useLocation} from 'react-router-dom'
import { useAuth } from '../contexts/Auth'

export const AuthRequired = ({children}) => {
    const location = useLocation()
    const {user} = useAuth()

    return (
        !user ? <Navigate to='/login' state={{prev: location}} replace /> : children    
    )
}