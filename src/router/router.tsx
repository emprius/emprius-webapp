import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from '~components/Home/HomePage'
import { NotFoundPage } from '~src/pages/NotFoundPage'
import { UserBookingsPage } from '~src/pages/bookings/UserBookingsPage'
import { Profile } from '~src/pages/profile/Profile'
import { UsersListPage } from '~src/pages/users/UsersListPage'
import { UserDetail } from '~src/pages/users/UserDetail'
import { EditProfile } from '~src/pages/profile/EditProfile'
import { UserRatingsPage } from '~src/pages/ratings/UserRatingsPage'
import { SearchPage } from '~src/pages/search/SearchPage'
import { ToolAddPage } from '~src/pages/tools/ToolAddPage'
import { ToolDetailPage } from '~src/pages/tools/ToolDetailPage'
import { ToolEditPage } from '~src/pages/tools/ToolEditPage'
import { ToolsListPage } from '~src/pages/tools/ToolsListPage'
import { ProtectedRoute } from '~src/router/ProtectedRoute'
import { Layout } from '../pages/Layout'
import { TitlePageLayout } from '~src/pages/TitlePageLayout'
import { FormLayout } from '~src/pages/FormLayout'
import { useAuthRoutes } from '~src/router/routes/auth'

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
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  ABOUT: '/about',
} as const

const routes = [
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
        element: <FormLayout />,
        children: [
          {
            path: ROUTES.PROFILE.EDIT,
            element: <EditProfile />,
          },
          {
            path: ROUTES.TOOLS.NEW,
            element: <ToolAddPage />,
          },
          {
            path: ROUTES.TOOLS.EDIT,
            element: <ToolEditPage />,
          },
        ],
      },
      {
        element: <TitlePageLayout />,
        children: [
          {
            path: ROUTES.BOOKINGS,
            element: <UserBookingsPage />,
          },
          {
            path: ROUTES.RATINGS,
            element: <UserRatingsPage />,
          },
          {
            path: ROUTES.USERS.LIST,
            element: <UsersListPage />,
          },
        ],
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
        path: ROUTES.USERS.DETAIL,
        element: <UserDetail />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

const useRoutes = () => ({
  path: ROUTES.HOME,
  element: <Layout />,
  children: routes,
})

export const AppRoutes = () => {
  const auth = useAuthRoutes()
  const routes = useRoutes()
  const router = createBrowserRouter([routes, auth])

  return <RouterProvider router={router} />
}
