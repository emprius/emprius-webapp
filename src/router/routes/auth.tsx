import { LoginPage } from '~src/pages/auth/LoginPage'
import { RegisterPage } from '~src/pages/auth/RegisterPage'
import { AuthLayout } from '~src/pages/AuthLayout'
import { ROUTES } from '~src/router/routes/index'

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
