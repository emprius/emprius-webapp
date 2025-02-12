import { lazy } from 'react'
import { Layout } from '~src/pages/Layout'
import { ROUTES } from '~src/router/routes/index'
import { SuspenseLoader } from '~src/router/SuspenseLoader'

const HomePage = lazy(() => import('~src/pages/home/view').then((m) => ({ default: m.HomePage })))
const NotFoundPage = lazy(() => import('~src/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

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
]

export const useRootRoutes = () => ({
  path: ROUTES.HOME,
  element: <Layout />,
  children: RootRoutesElements,
})
