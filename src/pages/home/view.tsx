import { useAuth } from '~components/Auth/AuthContext'
import { AuthenticatedLanding } from '~components/Home/AuthenticatedLanding'
import { Landing } from '~components/Home/Landing'

export const HomePage = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <AuthenticatedLanding />
  }

  return <Landing />
}
