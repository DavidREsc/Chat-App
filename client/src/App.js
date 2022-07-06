import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Chat from './routes/Chat'
import Login from './routes/Login'
import Signup from './routes/Signup'
import { AuthProvider } from './contexts/Auth'
import { AuthRequired } from './utils/AuthRequired'

const App = () => {
  return (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
          <Route 
            path="/" 
            element={
                <AuthRequired>
                  <Chat/>
                </AuthRequired>
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
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  )
}

export default App