import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useAuthRoutes } from '~src/router/routes/auth'
import { useRootRoutes } from '~src/router/routes/root'
import { useDashboardRoutes } from '~src/router/routes/dashboard'

export const AppRoutes = () => {
  const auth = useAuthRoutes()
  const root = useRootRoutes()
  const dashboard = useDashboardRoutes()
  const router = createBrowserRouter([root, dashboard, auth])

  return <RouterProvider router={router} />
}
