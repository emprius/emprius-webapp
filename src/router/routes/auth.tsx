import { LoginPage } from '~src/pages/auth/LoginPage'
import { RegisterPage } from '~src/pages/auth/RegisterPage'
import { ROUTES } from '~src/router/router'
import { AuthLayout } from '~src/pages/AuthLayout'

const AuthRoutesElements = [
  {
    path: ROUTES.AUTH.LOGIN.slice(1),
    element: <LoginPage />,
  },
  {
    path: ROUTES.AUTH.REGISTER.slice(1),
    element: <RegisterPage />,
  },
]

export const useAuthRoutes = () => ({
  element: <AuthLayout />,
  children: AuthRoutesElements,
})
