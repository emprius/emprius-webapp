import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { NavigationDependingProviders } from '~src/Providers'
import { useAuthRoutes } from '~src/router/routes/auth'
import { useDashboardRoutes } from '~src/router/routes/dashboard'
import { useRootRoutes } from '~src/router/routes/root'

export const AppRoutes = () => {
  const auth = useAuthRoutes()
  const root = useRootRoutes()
  const dashboard = useDashboardRoutes()
  const router = createBrowserRouter([
    {
      element: (
        <NavigationDependingProviders>
          <Outlet />
        </NavigationDependingProviders>
      ),
      children: [root, dashboard, auth],
    },
  ])

  return <RouterProvider router={router} />
}
