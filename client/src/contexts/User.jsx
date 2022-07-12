import React, {useContext, createContext, useState} from 'react'

const UserContext = createContext()
export const useUser = () => {
    return useContext(UserContext)
}

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(false)

    const login = async (user) => {
        setUser(user) 
    }

    const logout = async () => {
        setUser(false)
    }

    const value = {
        user,
        login,
        logout
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}