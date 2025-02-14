import { TFunction } from 'i18next'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'

interface TitleContextType {
  setTitle: (title: string) => void
}

const TitleContext = createContext<TitleContextType | undefined>(undefined)

const baseTitle = import.meta.env.title

const getDefaultTitle = (pathname: string, t: TFunction): string => {
  // Map routes to titles
  switch (pathname) {
    case ROUTES.HOME:
      return baseTitle
    case ROUTES.SEARCH:
      return `${t('pages.search')} | ${baseTitle}`
    case ROUTES.TOOLS.LIST:
      return `${t('pages.tools.list')} | ${baseTitle}`
    case ROUTES.PROFILE.VIEW:
      return `${t('pages.profile.view')} | ${baseTitle}`
    case ROUTES.PROFILE.EDIT:
      return `${t('pages.profile.edit')} | ${baseTitle}`
    case ROUTES.BOOKINGS.PETITIONS:
      return `${t('pages.bookings.petitions')} | ${baseTitle}`
    case ROUTES.BOOKINGS.REQUESTS:
      return `${t('pages.bookings.requests')} | ${baseTitle}`
    case ROUTES.RATINGS.PENDING:
      return `${t('pages.ratings.pending')} | ${baseTitle}`
    case ROUTES.RATINGS.SUBMITTED:
      return `${t('pages.ratings.submitted')} | ${baseTitle}`
    case ROUTES.RATINGS.RECEIVED:
      return `${t('pages.ratings.received')} | ${baseTitle}`
    case ROUTES.USERS.LIST:
      return `${t('pages.users.list')} | ${baseTitle}`
    case ROUTES.AUTH.LOGIN:
      return `${t('pages.auth.login')} | ${baseTitle}`
    case ROUTES.AUTH.REGISTER:
      return `${t('pages.auth.register')} | ${baseTitle}`
    default:
      // todo(kon): use matchPath https://github.com/remix-run/react-router/blob/a3e4b8ed875611637357647fcf862c2bc61f4e11/packages/react-router/lib/hooks.tsx#L173
      // Handle dynamic routes
      if (pathname.match(/^\/tools\/\d+$/)) {
        return `Tool Details | ${baseTitle}`
      }
      if (pathname.match(/^\/tools\/\d+\/edit$/)) {
        return `Edit Tool | ${baseTitle}`
      }
      if (pathname.match(/^\/users\/\d+$/)) {
        return `User Details | ${baseTitle}`
      }
      return baseTitle
  }
}

export const TitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState<string>('')
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    if (title) {
      document.title = `${title} | ${baseTitle}`
    } else {
      document.title = getDefaultTitle(location.pathname, t)
    }
  }, [location, title, t])

  return <TitleContext.Provider value={{ setTitle }}>{children}</TitleContext.Provider>
}

export const useTitle = () => {
  const context = useContext(TitleContext)
  if (context === undefined) {
    throw new Error('useTitle must be used within a TitleProvider')
  }
  return context
}

// Change provider title and reset on umount
export const useCustomPageTitle = (title?: string) => {
  const { setTitle: providerSetTitle } = useTitle()
  // Change page title adding information and reset on umount
  useEffect(() => {
    if (title) {
      providerSetTitle(`${title}`)
    }
    return () => {
      providerSetTitle('')
    }
  }, [title, providerSetTitle])
}
