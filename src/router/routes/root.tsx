import { HomePage } from '~components/Home/HomePage'
import { NotFoundPage } from '~src/pages/NotFoundPage'
import { Layout } from '~src/pages/Layout'
import { ROUTES } from '~src/router/routes/index'

const RootRoutesElements = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

export const useRootRoutes = () => ({
  path: ROUTES.HOME,
  element: <Layout />,
  children: RootRoutesElements,
})
