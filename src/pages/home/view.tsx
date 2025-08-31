import { useAuth } from '~components/Auth/AuthContext'
import { Landing } from '~components/Home/Landing'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'

export const HomePage = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.SEARCH} replace />
  }

  return <Landing />
}
