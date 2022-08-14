import React, {useEffect, useContext, createContext, useState} from 'react'
import {useNavigate } from 'react-router-dom'
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
    const navigate = useNavigate()

    useEffect(() => {
        socket.connect()
        socket.on('connect', (e) => {
            setLoading(false)
        })
        socket.on("connect_error", (e) => {
            navigate('/login', {replace: true})
        })

        socket.on('error', (e) => {
            navigate('/login', {replace: true})
        })

        socket.on('disconnect-concurrent-connection', () => {
            socket.disconnect()
        })
        return () => {
            socket.off('connect')
            socket.off('connect_error')
            socket.off('error')
            socket.disconnect()
        }
    },[navigate])
    
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

