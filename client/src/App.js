import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Chat from './routes/Chat'
import Login from './routes/Login'
import Signup from './routes/Signup'
import { AuthProvider } from './contexts/Auth'
import { AuthRequired } from './utils/AuthRequired'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route 
            path="/" 
            element={
              <AuthProvider>
                <AuthRequired>
                  <Chat/>
                </AuthRequired>
              </AuthProvider>
            }
          />   
        <Route 
          path="/login" 
          element={
            <AuthProvider>
              <Login/>
            </AuthProvider>       
          }
        />
        <Route 
          path="/signup" 
          element={
            <AuthProvider>
              <Signup/>
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App