import React from 'react'
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { useInfoContext } from '~components/InfoProviders/InfoContext'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ServerErrorPage } from '~src/pages/ServerErrorPage'

import { ROUTES } from '~src/router/routes'

export const ProtectedRoute = () => {
  const context = useOutletContext()
  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth()
  const { isLoading: isLoadingInfo, isError: isErrorInfo, isData } = useInfoContext()
  const location = useLocation()

  // Show loading spinner while fetching auth or info data
  if (isLoadingAuth || isLoadingInfo) {
    return <LoadingSpinner />
  }

  // Show server error page if info query fails and no previous data
  if (isErrorInfo && !isData) {
    return <ServerErrorPage />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet context={context} />
}
