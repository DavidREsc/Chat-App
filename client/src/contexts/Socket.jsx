import React, {useEffect, useContext, createContext, useState} from 'react'
import { Spinner } from '@chakra-ui/react'
import {io} from 'socket.io-client'
const socket = io({
    autoConnect: false,
})

const SocketContext = createContext()
export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({children}) => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        socket.connect()
        socket.on('connect', () => {
            console.log("Connect")
            setLoading(false)
        })
    },[])
    
    const value = {
        socket
    }

    return (
        <SocketContext.Provider value={value}>
            {loading ? 
            <div className='loading-page'>
                <Spinner  
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </div>
            : children}
        </SocketContext.Provider>
    )
}

