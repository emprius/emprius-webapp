import { lazy } from 'react'
import { ProtectedRoute } from '~src/router/ProtectedRoute'
import { FormLayout } from '~src/pages/FormLayout'
import { TitlePageLayout } from '~src/pages/TitlePageLayout'
import { SuspenseLoader } from '~src/router/SuspenseLoader'
import { ROUTES } from '~src/router/routes/index'
import { Layout } from '~src/pages/Layout'

const SearchPage = lazy(() => import('~src/pages/search/view').then((m) => ({ default: m.View })))
const Profile = lazy(() => import('~src/pages/profile/view').then((m) => ({ default: m.View })))
const EditProfile = lazy(() => import('~src/pages/profile/edit').then((m) => ({ default: m.Edit })))
const ToolAddPage = lazy(() => import('~src/pages/tools/add').then((m) => ({ default: m.Add })))
const ToolEditPage = lazy(() => import('~src/pages/tools/edit').then((m) => ({ default: m.Edit })))
const UserBookingsPage = lazy(() =>
  import('~src/pages/bookings/UserBookingsPage').then((m) => ({ default: m.UserBookingsPage }))
)
const UserRatingsPage = lazy(() => import('~src/pages/ratings/view').then((m) => ({ default: m.View })))
const UsersListPage = lazy(() => import('~src/pages/users/list').then((m) => ({ default: m.List })))
const ToolsListPage = lazy(() => import('~src/pages/tools/list').then((m) => ({ default: m.List })))
const ToolDetailPage = lazy(() => import('~src/pages/tools/detail').then((m) => ({ default: m.Detail })))
const UserDetail = lazy(() => import('~src/pages/users/detail').then((m) => ({ default: m.Detail })))

const DashboardRoutesElements = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.SEARCH,
        element: (
          <SuspenseLoader>
            <SearchPage />
          </SuspenseLoader>
        ),
      },
      {
        path: ROUTES.PROFILE.VIEW,
        element: (
          <SuspenseLoader>
            <Profile />
          </SuspenseLoader>
        ),
      },
      {
        element: <FormLayout />,
        children: [
          {
            path: ROUTES.PROFILE.EDIT,
            element: (
              <SuspenseLoader>
                <EditProfile />
              </SuspenseLoader>
            ),
          },
          {
            path: ROUTES.TOOLS.NEW,
            element: (
              <SuspenseLoader>
                <ToolAddPage />
              </SuspenseLoader>
            ),
          },
          {
            path: ROUTES.TOOLS.EDIT,
            element: (
              <SuspenseLoader>
                <ToolEditPage />
              </SuspenseLoader>
            ),
          },
        ],
      },
      {
        element: <TitlePageLayout />,
        children: [
          {
            path: ROUTES.BOOKINGS,
            element: (
              <SuspenseLoader>
                <UserBookingsPage />
              </SuspenseLoader>
            ),
          },
          {
            path: ROUTES.RATINGS,
            element: (
              <SuspenseLoader>
                <UserRatingsPage />
              </SuspenseLoader>
            ),
          },
          {
            path: ROUTES.USERS.LIST,
            element: (
              <SuspenseLoader>
                <UsersListPage />
              </SuspenseLoader>
            ),
          },
        ],
      },
      {
        path: ROUTES.TOOLS.LIST,
        element: (
          <SuspenseLoader>
            <ToolsListPage />
          </SuspenseLoader>
        ),
      },
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

export const useDashboardRoutes = () => ({
  element: <Layout />,
  children: DashboardRoutesElements,
})
