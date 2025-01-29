import React, { createContext, useContext } from 'react'
import { useInfo as useInfoQuery } from './infoQueries'
import { Category, Transport } from './infoTypes'

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
  const { data, isLoading, isError } = useInfoQuery()

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
