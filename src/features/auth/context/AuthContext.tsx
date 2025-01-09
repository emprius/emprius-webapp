import { useQueryClient } from '@tanstack/react-query'
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { LoginResponse, useCurrentUser, useLogin, useRegister } from '~src/features/auth/context/authQueries'
import { STORAGE_KEYS } from '../../../constants'

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

  // todo(konv1): this is not the place for that
  // const updateUserMutation = useMutation({
  //   mutationFn: async (userData: UserProfile) => {
  //     return userData
  //   },
  //   onSuccess: (userData) => {
  //     queryClient.setQueryData(['user'], userData)
  //   },
  // })

  const { data: user, isLoading: isLoadingUser } = useCurrentUser({
    enabled: !!bearer,
  })

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.EXPIRITY)
    setBearer(null)
    queryClient.setQueryData(['user'], null)
  }

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
