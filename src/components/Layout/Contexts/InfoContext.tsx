import React, { createContext, useContext, useMemo } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import api from '~src/services/api'
import { useAuth } from '~components/Auth/AuthContext'
import { useTranslation } from 'react-i18next'

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

// i18next-extract-mark-ns:categories
// t('categories.other', { defaultValue: 'Other' })
// t('categories.transport', { defaultValue: 'Transport' })
// t('categories.construction', { defaultValue: 'Construction' })
// t('categories.agriculture', { defaultValue: 'Agriculture' })
// t('categories.communication', { defaultValue: 'Communication' })
// t('categories.livestock', { defaultValue: 'Livestock' })

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
  const { t } = useTranslation()

  const categoriesTranslated = useMemo(
    () =>
      data?.categories.map((category) => ({
        ...category,
        name: t(`categories.${category.name}`, { defaultValue: category.name }),
      })) || [],
    [data?.categories, t]
  )

  const value: InfoContextType = {
    categories: categoriesTranslated,
    transports: data?.transports || [],
    users: data?.users || 0,
    tools: data?.tools || 0,
    isLoading,
    isError,
    isData: !!data,
  }

  return <InfoContext.Provider value={value}>{children}</InfoContext.Provider>
}
