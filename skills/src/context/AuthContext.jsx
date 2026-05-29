import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI as authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, try to restore session from token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authApi.me()
        .then(res => setUser(res.data.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials)
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (data) => {
    const res = await authApi.register(data)
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {})
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await authApi.me()
    setUser(res.data.data)
  }, [])

  const updateProfile = useCallback(async (data) => {
    const res = await authApi.updateProfile(data)
    setUser(res.data.data)
    return res.data
  }, [])

  const deleteAccount = useCallback(async (data) => {
    await authApi.deleteAccount(data)
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  // Roles: student | tenant_admin | super_admin
  const isStudent    = user?.role === 'student'
  const isTenantAdmin = user?.role === 'tenant_admin'
  const isSuperAdmin = user?.role === 'super_admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateProfile, deleteAccount, isStudent, isTenantAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)