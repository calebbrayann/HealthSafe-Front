"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { getMe } from '@/lib/api'

interface User {
  id: string
  email: string
  role: string
  nom?: string
  prenom?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      setLoading(true)
      const userData = await getMe()
      console.log("Session active :", userData)
      setUser(userData)
    } catch (error) {
      console.log("Session invalide, redirection vers /")
      setUser(null)
      // Ne pas rediriger automatiquement ici, laisser les composants décider
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    router.push('/')
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
