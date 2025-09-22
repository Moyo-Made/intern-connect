'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { UserType } from '@prisma/client'
import { authApi, tokenManager } from '@/lib/api-client'
import { RegistrationData, LoginData } from '@/lib/validation'
import { verifyToken } from '@/lib/auth'

// Types
export interface User {
  id: string
  email: string
  userType: UserType
  isVerified: boolean
  createdAt: string
}

export interface StudentProfile {
  id: string
  firstName: string
  lastName: string
  university: string
  major: string
  graduationYear: number
  phone?: string
  resumeUrl?: string
  bio?: string
  portfolioUrl?: string
  linkedinUrl?: string
  githubUrl?: string
}

export interface CompanyProfile {
  id: string
  companyName: string
  industry: string
  location: string
  website?: string
  description?: string
  companySize: string
  logoUrl?: string
}

export interface AuthUser {
  user: User
  profile: StudentProfile | CompanyProfile
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: true, // Start with loading true to check existing auth
  isAuthenticated: false,
  error: null,
}

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      }
    
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      }
    
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    
    default:
      return state
  }
}

// Context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginData) => Promise<{ success: boolean; message: string }>
  register: (userData: RegistrationData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  clearError: () => void
  checkAuthStatus: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is authenticated on app start
  const checkAuthStatus = async () => {
    const token = tokenManager.get()
    
    if (!token) {
      dispatch({ type: 'AUTH_ERROR', payload: 'No token found' })
      return
    }

    try {
      // You could verify token on client side or make an API call
      // For now, we'll assume token exists = authenticated
      // In production, you'd want to verify with the server
      
      // TODO: Make API call to verify token and get user data
      // const response = await authenticatedApiCall('/auth/me')
      
      // For now, we'll just clear the loading state
      dispatch({ type: 'AUTH_ERROR', payload: 'Token verification not implemented' })
    } catch (error) {
      tokenManager.remove()
      dispatch({ type: 'AUTH_ERROR', payload: 'Invalid token' })
    }
  }

  // Login function
  const login = async (credentials: LoginData) => {
    dispatch({ type: 'AUTH_START' })
    
    try {
      const response = await authApi.login(credentials)
      
      if (response.success && response.data) {
        tokenManager.set(response.data.token)
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: {
            user: response.data.user,
            profile: response.data.profile
          }
        })
        
        return { success: true, message: 'Login successful!' }
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.message })
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = 'Login failed. Please try again.'
      dispatch({ type: 'AUTH_ERROR', payload: message })
      return { success: false, message }
    }
  }

  // Register function
  const register = async (userData: RegistrationData) => {
    dispatch({ type: 'AUTH_START' })
    
    try {
      const response = await authApi.register(userData)
      
      if (response.success && response.data) {
        tokenManager.set(response.data.token)
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: {
            user: response.data.user,
            profile: response.data.profile
          }
        })
        
        return { success: true, message: 'Account created successfully!' }
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.message })
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = 'Registration failed. Please try again.'
      dispatch({ type: 'AUTH_ERROR', payload: message })
      return { success: false, message }
    }
  }

  // Logout function
  const logout = () => {
    tokenManager.remove()
    dispatch({ type: 'AUTH_LOGOUT' })
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus,
  }

  return (
    <AuthContext.Provider value={contextValue}>
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