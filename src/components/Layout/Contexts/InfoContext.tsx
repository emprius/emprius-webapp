import React, { createContext, useContext } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'
import { useAuth } from '~components/Auth/AuthContext'

export interface InfoData {
  users: number
  tools: number
  categories: Category[]
  transports: Transport[]
}

export interface Category {
  id: number
  name: string
}

export interface Transport {
  id: number
  name: string
}

const UseInfoKey = ['info']

export const useInfo = (options?: Omit<UseQueryOptions<InfoData>, 'queryKey' | 'queryFn'>) => {
  return useQuery<InfoData>({
    queryKey: UseInfoKey,
    queryFn: () => api.info.getInfo(),
    ...options,
  })
}

interface InfoContextType {
  isLoading: boolean
  isError: boolean
  categories: Category[]
  transports: Transport[]
  users: number
  tools: number
  isData: boolean
}

const InfoContext = createContext<InfoContextType | undefined>(undefined)

export const useInfoContext = () => {
  const context = useContext(InfoContext)
  if (!context) {
    throw new Error('useInfo must be used within an InfoProvider')
  }
  return context
}

interface InfoProviderProps {
  children: React.ReactNode
}

export const InfoProvider = ({ children }: InfoProviderProps) => {
  const { isAuthenticated } = useAuth()
  const { data, isLoading, isError } = useInfo({ enabled: isAuthenticated })

  const value: InfoContextType = {
    categories: data?.categories || [],
    transports: data?.transports || [],
    users: data?.users || 0,
    tools: data?.tools || 0,
    isLoading,
    isError,
    isData: !!data,
  }

  return <InfoContext.Provider value={value}>{children}</InfoContext.Provider>
}
