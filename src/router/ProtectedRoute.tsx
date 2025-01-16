import React from 'react'
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ROUTES } from '~src/router/router'

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
