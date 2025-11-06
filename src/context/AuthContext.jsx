import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { userContext } from './UserContext'; // eslint-disable-line no-unused-vars

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await axios.post('/api/auth/verify', {}, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          if (response.data.success) {
            setUser(response.data.user)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.log(error)
        if (error.response && !error.response.data.success) {
          setUser(null)
          setLoading(false)
        }
      } finally {
        setLoading(false)
      }
    }
    verifyUser()
  }, [])
  const login = (user) => {
    setUser(user);
  }
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token')
  }
  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  )
}

export default AuthContext
