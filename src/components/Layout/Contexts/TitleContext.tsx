import { TFunction } from 'i18next'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, matchPath } from 'react-router-dom'
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
    case ROUTES.TOOLS.NEW:
      return `${t('pages.tools.new')} | ${baseTitle}`
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
    case ROUTES.RATINGS.HISTORY:
      return `${t('pages.ratings.submitted')} | ${baseTitle}`
    case ROUTES.USERS.LIST:
      return `${t('pages.users.list')} | ${baseTitle}`
    case ROUTES.AUTH.LOGIN:
      return `${t('pages.auth.login')} | ${baseTitle}`
    case ROUTES.AUTH.REGISTER:
      return `${t('pages.auth.register')} | ${baseTitle}`
    case ROUTES.COMMUNITIES.LIST:
      return `${t('pages.communities.list')} | ${baseTitle}`
    case ROUTES.COMMUNITIES.NEW:
      return `${t('pages.communities.new')} | ${baseTitle}`
    case ROUTES.COMMUNITIES.INVITES:
      return `${t('pages.communities.invites')} | ${baseTitle}`
    case ROUTES.ABOUT:
      return `${t('pages.about')} | ${baseTitle}`
    case ROUTES.MESSAGES.CONVERSATIONS:
      return `${t('pages.conversations', { defaultValue: 'Messages' })} | ${baseTitle}`
    default:
      // Handle dynamic routes using matchPath
      if (matchPath(ROUTES.TOOLS.DETAIL, pathname)) {
        return `${t('pages.tools.detail')} | ${baseTitle}`
      }
      if (matchPath(ROUTES.TOOLS.EDIT, pathname)) {
        return `${t('pages.tools.edit')} | ${baseTitle}`
      }
      if (matchPath(ROUTES.BOOKINGS.DETAIL, pathname)) {
        return `${t('pages.bookings.detail')} | ${baseTitle}`
      }
      if (
        matchPath(ROUTES.USERS.DETAIL, pathname) ||
        matchPath(ROUTES.USERS.TABS.TOOLS, pathname) ||
        matchPath(ROUTES.USERS.TABS.RATINGS, pathname)
      ) {
        return `${t('pages.users.detail')} | ${baseTitle}`
      }
      if (matchPath(ROUTES.COMMUNITIES.DETAIL, pathname)) {
        return `${t('pages.communities.detail')} | ${baseTitle}`
      }
      if (matchPath(ROUTES.COMMUNITIES.EDIT, pathname)) {
        return `${t('pages.communities.edit')} | ${baseTitle}`
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
