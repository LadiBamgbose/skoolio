import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { AuthService } from '../services'
import type { AuthTypes } from '../types/auth.types'

interface AuthContextType {
  user: AuthTypes.User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: AuthTypes.RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthTypes.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = AuthService.getToken()
      
      if (token) {
        try {
          const response = await AuthService.me()
          setUser(response.user)
        } catch (error) {
          console.error('Failed to fetch user:', error)
          // Token is invalid, remove it
          AuthService.logout()
        }
      }
      
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password })
    setUser(response.user)
  }

  const register = async (data: AuthTypes.RegisterRequest) => {
    const response = await AuthService.register(data)
    setUser(response.user)
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  const refreshUser = async () => {
    const response = await AuthService.me()
    setUser(response.user)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

