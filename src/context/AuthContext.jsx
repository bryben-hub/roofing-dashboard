import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../services/api'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await auth.me()
        setUser(response.data.user)
        setOrganization(response.data.organization)
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }

  async function login(email, password) {
    const response = await auth.login({ email, password })
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
    setOrganization(response.data.organization)
    return response.data
  }

  async function register(data) {
    const response = await auth.register(data)
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
    setOrganization(response.data.organization)
    return response.data
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
    setOrganization(null)
  }

  return (
    <AuthContext.Provider value={{ user, organization, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
