import { useQueryClient } from '@tanstack/react-query'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { UNAUTHORIZED_EVENT } from '../../services/queryClient'
import { LoginResponse, useCurrentUser, useLogin, useRegister } from '~components/Auth/queries'
import { STORAGE_KEYS } from '~utils/constants'
import { useTranslation } from 'react-i18next'

export const AuthContext = createContext<ReturnType<typeof useAuthProvider> | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthProvider()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

const useAuthProvider = () => {
  const queryClient = useQueryClient()
  const { i18n } = useTranslation()
  const [bearer, setBearer] = useState<string | null>(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN))

  const login = useLogin({
    onSuccess: (data) => {
      storeLogin(data)
    },
  })

  const register = useRegister({
    onSuccess: (data) => {
      storeLogin(data)
    },
  })

  const storeLogin = useCallback(({ token, expirity }: LoginResponse) => {
    setBearer(token)
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.EXPIRITY, expirity)
  }, [])

  const { data: user, isLoading: isLoadingUser } = useCurrentUser({
    enabled: !!bearer,
  })

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.EXPIRITY)
    setBearer(null)
    queryClient.clear()
  }, [queryClient])

  // Listen for unauthorized events
  useEffect(() => {
    // Handler for unauthorized events
    const handleUnauthorized = () => {
      console.log('Unauthorized access detected, logging out')
      logout()
    }

    // Add event listener
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    }
  }, [logout])

  // Set user configured language
  useEffect(() => {
    if (!user || !user.lang || !i18n) return
    const userLang = user?.lang
    if (userLang && i18n.language !== userLang) {
      i18n.changeLanguage(userLang)
    }
  }, [user, i18n])

  const isAuthenticated = useMemo(() => !!bearer, [bearer])
  const isLoading = useMemo(() => !!bearer && isLoadingUser, [bearer, isLoadingUser])

  return {
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    user,
  }
}
