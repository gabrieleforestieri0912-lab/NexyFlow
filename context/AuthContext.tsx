'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { trackGAEvent, identifyGA } from '@/components/GAProvider'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: string
  daily_queries_count?: number
  last_query_date?: string
  connected_platforms?: Record<string, boolean>
  social_stats?: Record<string, any>
  language?: string
  created_at?: string
  updated_at?: string
  onboarding_completed?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  googleLogin: (token: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

async function getTokenFromStorage(): Promise<string | undefined> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    const stored = await chrome.storage.local.get('token')
    return stored.token
  }
  return undefined
}

async function saveAuthToStorage(data: { token?: string; user?: any }) {
  if (data.token && typeof chrome !== 'undefined' && chrome.storage?.local) {
    await chrome.storage.local.set({ token: data.token, user: data.user })
  }
}

async function removeAuthFromStorage() {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    await chrome.storage.local.remove(['token', 'user'])
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = await getTokenFromStorage()
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const data = await res.json()
      if (data.user) {
        identifyGA(data.user.id, { email: data.user.email, name: data.user.name, plan: data.user.plan })
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error)
    }

    if (data.user) {
      identifyGA(data.user.id, { email: data.user.email, name: data.user.name })
      trackGAEvent('login', { method: 'email' })
      setUser(data.user)
      await saveAuthToStorage(data)
    }
    await checkAuth()
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error)
    }

    if (data.user) {
      identifyGA(data.user.id, { email: data.user.email, name: data.user.name })
      trackGAEvent('sign_up', { method: 'email' })
      setUser(data.user)
      await saveAuthToStorage(data)
    }
    await checkAuth()
  }

  const googleLogin = async (token: string) => {
    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error)
    }

    if (data.user) {
      identifyGA(data.user.id, { email: data.user.email, name: data.user.name })
      trackGAEvent('login', { method: 'google' })
      setUser(data.user)
      await saveAuthToStorage(data)
    }
    await checkAuth()
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error)
    }

    return data
  }

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST' })
    await removeAuthFromStorage()
    setUser(null)
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, checkAuth, changePassword }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
