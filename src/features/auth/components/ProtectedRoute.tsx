import React from 'react'
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { ROUTES } from '~src/router'
import { LoadingSpinner } from '~components/shared'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = () => {
  const context = useOutletContext()
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet context={context} />
}
