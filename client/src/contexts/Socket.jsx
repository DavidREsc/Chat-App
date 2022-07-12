import React, {useEffect, useContext, createContext} from 'react'
import {io} from 'socket.io-client'
const socket = io({
    autoConnect: false,
})

const SocketContext = createContext()
export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({children}) => {

    useEffect(() => {
        socket.connect()
        console.log('connect')
    },[])
    
    const value = {
        socket
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

