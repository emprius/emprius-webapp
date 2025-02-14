import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'

interface TitleContextType {
  setTitle: (title: string) => void
}

const TitleContext = createContext<TitleContextType | undefined>(undefined)

const baseTitle = import.meta.env.title

const getDefaultTitle = (pathname: string): string => {
  // Map routes to titles
  switch (pathname) {
    case ROUTES.HOME:
      return baseTitle
    case ROUTES.SEARCH:
      return `Search | ${baseTitle}`
    case ROUTES.TOOLS.LIST:
      return `Tools | ${baseTitle}`
    case ROUTES.PROFILE.VIEW:
      return `Profile | ${baseTitle}`
    case ROUTES.PROFILE.EDIT:
      return `Edit Profile | ${baseTitle}`
    case ROUTES.BOOKINGS.PETITIONS:
      return `Booking Petitions | ${baseTitle}`
    case ROUTES.BOOKINGS.REQUESTS:
      return `Booking Requests | ${baseTitle}`
    case ROUTES.RATINGS.PENDING:
      return `Pending Ratings | ${baseTitle}`
    case ROUTES.RATINGS.SUBMITTED:
      return `Submitted Ratings | ${baseTitle}`
    case ROUTES.RATINGS.RECEIVED:
      return `Received Ratings | ${baseTitle}`
    case ROUTES.USERS.LIST:
      return `Users | ${baseTitle}`
    case ROUTES.AUTH.LOGIN:
      return `Login | ${baseTitle}`
    case ROUTES.AUTH.REGISTER:
      return `Register | ${baseTitle}`
    default:
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

  useEffect(() => {
    if (title) {
      // let prepend = 'Vocdoni'
      document.title = `${title} | ${baseTitle}`
    } else {
      document.title = getDefaultTitle(location.pathname)
    }
  }, [location, title])

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
