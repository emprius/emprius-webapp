import { lazy } from 'react'
import { AuthLayout } from '~src/pages/AuthLayout'
import { ROUTES } from '~src/router/routes/index'
import { SuspenseLoader } from '~src/router/SuspenseLoader'

const LoginPage = lazy(() => import('~src/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('~src/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))

const AuthRoutesElements = [
  {
    path: ROUTES.AUTH.LOGIN.slice(1),
    element: <SuspenseLoader><LoginPage /></SuspenseLoader>,
  },
  {
    path: ROUTES.AUTH.REGISTER.slice(1),
    element: <SuspenseLoader><RegisterPage /></SuspenseLoader>,
  },
]

export const useAuthRoutes = () => ({
  element: <AuthLayout />,
  children: AuthRoutesElements,
})
