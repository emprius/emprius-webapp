import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { NavigationDependingProviders } from '~src/Providers'
import { useAuthRoutes } from '~src/router/routes/auth'
import { useDashboardRoutes } from '~src/router/routes/dashboard'
import { useRootRoutes } from '~src/router/routes/root'
import { ChunkErrorBoundary } from '~src/router/ChunkErrorBoundary'

export const AppRoutes = () => {
  const auth = useAuthRoutes()
  const root = useRootRoutes()
  const dashboard = useDashboardRoutes()

  // Use the base URL from Vite config
  const basename = import.meta.env.BASE_URL

  const router = createBrowserRouter(
    [
      {
        element: (
          // <ChunkErrorBoundary>
          <NavigationDependingProviders>
            <Outlet />
          </NavigationDependingProviders>
          // </ChunkErrorBoundary>
        ),
        children: [root, dashboard, auth],
      },
    ],
    {
      basename, // Set the basename for the router
    }
  )

  return <RouterProvider router={router} />
}
