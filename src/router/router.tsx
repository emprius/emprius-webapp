import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from '~components/Home/HomePage'
import { LoginPage } from '~src/pages/auth/LoginPage'
import { RegisterPage } from '~src/pages/auth/RegisterPage'
import { AuthLayout } from '~src/pages/AuthLayout'
import { NotFoundPage } from '~src/pages/NotFoundPage'
import { UserBookingsPage } from '~src/pages/bookings/UserBookingsPage'
import { Profile } from '~src/pages/profile/Profile'
import { EditProfile } from '~src/pages/profile/EditProfile'
import { UserRatingsPage } from '~src/pages/ratings/UserRatingsPage'
import { SearchPage } from '~src/pages/search/SearchPage'
import { ToolAddPage } from '~src/pages/tools/ToolAddPage'
import { ToolDetailPage } from '~src/pages/tools/ToolDetailPage'
import { ToolEditPage } from '~src/pages/tools/ToolEditPage'
import { ToolsListPage } from '~src/pages/tools/ToolsListPage'
import { ProtectedRoute } from '~src/router/ProtectedRoute'
import { Layout } from '../pages/Layout'

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  TOOLS: {
    LIST: '/tools',
    DETAIL: '/tools/:id',
    EDIT: `/tools/:id/edit`,
    NEW: '/tools/new',
  },
  PROFILE: {
    VIEW: '/profile',
    EDIT: '/profile/edit',
  },
  BOOKINGS: '/bookings',
  RATINGS: '/ratings',
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
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.SEARCH,
            element: <SearchPage />,
          },
          {
            path: ROUTES.PROFILE.VIEW,
            element: <Profile />,
          },
          {
            path: ROUTES.PROFILE.EDIT,
            element: <EditProfile />,
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
            element: <ToolEditPage />,
          },
          {
            path: ROUTES.TOOLS.NEW,
            element: <ToolAddPage />,
          },
          {
            path: ROUTES.BOOKINGS,
            element: <UserBookingsPage />,
          },
          {
            path: ROUTES.RATINGS,
            element: <UserRatingsPage />,
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
