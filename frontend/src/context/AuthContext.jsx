import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getMe, loginUser, logoutUser, registerUser } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const { data } = await getMe()
      setUser(data.user)
    } catch {
      setUser(null)
      localStorage.removeItem('nexora_token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refreshUser() }, [])

  const login = async (payload) => {
    const { data } = await loginUser(payload)
    localStorage.setItem('nexora_token', data.token)
    setUser(data.user)
    toast.success('Welcome back')
  }

  const register = async (payload) => {
    const { data } = await registerUser(payload)
    localStorage.setItem('nexora_token', data.token)
    setUser(data.user)
    toast.success('Account created')
  }

  const logout = async () => {
    try { await logoutUser() } catch {}
    localStorage.removeItem('nexora_token')
    setUser(null)
    toast.success('Logged out')
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshUser }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
