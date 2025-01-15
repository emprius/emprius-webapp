import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { HomePage } from './features/home/HomePage'
import { SearchPage } from './features/tools/pages/SearchPage'
import { ToolsListPage } from './features/tools/pages/ToolsListPage'
import { ToolDetailPage } from './features/tools/pages/ToolDetailPage'
import { NewToolPage } from './features/tools/pages/NewToolPage'
import { EditToolPage } from './features/tools/pages/EditToolPage'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { ProfilePage } from './features/user/pages/ProfilePage'
import { NotFoundPage } from './features/error/NotFoundPage'
import { ProtectedRoute } from './features/auth/components/ProtectedRoute'
import { AuthLayout } from './features/auth/components/AuthLayout'

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  TOOLS: {
    LIST: '/tools',
    DETAIL: '/tools/:id',
    EDIT: `/tools/:id/edit`,
    NEW: '/tools/new',
  },
  PROFILE: '/profile',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  ABOUT: '/about',
} as const

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.SEARCH,
        element: <SearchPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.PROFILE,
            element: <ProfilePage />,
          },
          {
            path: ROUTES.TOOLS.LIST,
            element: <ToolsListPage />,
          },
          {
            path: ROUTES.TOOLS.DETAIL,
            element: <ToolDetailPage />,
          },
          {
            path: ROUTES.TOOLS.EDIT,
            element: <EditToolPage />,
          },
          {
            path: ROUTES.TOOLS.NEW,
            element: <NewToolPage />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.AUTH.LOGIN.slice(1),
        element: <LoginPage />,
      },
      {
        path: ROUTES.AUTH.REGISTER.slice(1),
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export const AppRoutes = () => {
  return <RouterProvider router={router} />
}
