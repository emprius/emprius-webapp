import { lazy } from 'react'
import { AuthLayout } from '~src/pages/AuthLayout'
import { ROUTES } from '~src/router/routes/index'
import { SuspenseLoader } from '~src/router/SuspenseLoader'

const LoginPage = lazy(() => import('~src/pages/auth/login').then((m) => ({ default: m.Login })))
const RegisterPage = lazy(() => import('~src/pages/auth/register').then((m) => ({ default: m.Register })))

const AuthRoutesElements = [
  {
    path: ROUTES.AUTH.LOGIN.slice(1),
    element: (
      <SuspenseLoader>
        <LoginPage />
      </SuspenseLoader>
    ),
  },
  {
    path: ROUTES.AUTH.REGISTER.slice(1),
    element: (
      <SuspenseLoader>
        <RegisterPage />
      </SuspenseLoader>
    ),
  },
]

export const useAuthRoutes = () => ({
  element: <AuthLayout />,
  children: AuthRoutesElements,
})
