import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Chat from './routes/Chat'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Verify from './routes/Verify'
import {ChakraProvider} from  '@chakra-ui/react'
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/Auth'
import { SocketProvider } from './contexts/Socket'
import './styles/app.css'

const App = () => {
  return (
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
              <Route 
                path="/" 
                element={
                    <AuthProvider>
                     <SocketProvider>
                      <Chat/>
                     </SocketProvider>  
                    </AuthProvider>              
                }
              />   
            <Route 
              path="/login" 
              element={
                  <Login/>       
              }
            />
            <Route 
              path="/signup" 
              element={
                  <Signup/>
              }
            />
            <Route
              path='user/verify/:id'
              element={<Verify/>}
            />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
  )
}

export default App