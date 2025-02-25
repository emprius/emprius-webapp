import { lazy } from 'react'
import { Layout } from '~src/pages/Layout'
import { ROUTES } from '~src/router/routes/index'
import { SuspenseLoader } from '~src/router/SuspenseLoader'
import { ProtectedRoute } from '~src/router/ProtectedRoute'

const HomePage = lazy(() => import('~src/pages/home/view').then((m) => ({ default: m.HomePage })))
const NotFoundPage = lazy(() => import('~src/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const ToolDetailPage = lazy(() => import('~src/pages/tools/detail').then((m) => ({ default: m.Detail })))
const UserDetail = lazy(() => import('~src/pages/users/detail').then((m) => ({ default: m.Detail })))

const RootRoutesElements = [
  {
    index: true,
    element: (
      <SuspenseLoader>
        <HomePage />
      </SuspenseLoader>
    ),
  },
  {
    path: '*',
    element: (
      <SuspenseLoader>
        <NotFoundPage />
      </SuspenseLoader>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.TOOLS.DETAIL,
        element: (
          <SuspenseLoader>
            <ToolDetailPage />
          </SuspenseLoader>
        ),
      },
      {
        path: ROUTES.USERS.DETAIL,
        element: (
          <SuspenseLoader>
            <UserDetail />
          </SuspenseLoader>
        ),
      },
    ],
  },
]

export const useRootRoutes = () => ({
  path: ROUTES.HOME,
  element: <Layout />,
  children: RootRoutesElements,
})
