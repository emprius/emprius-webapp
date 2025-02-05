import { lazy } from 'react'
import { DashboardLayout } from '~src/pages/DashboardLayout'
import { FormLayout } from '~src/pages/FormLayout'
import { Layout } from '~src/pages/Layout'
import { TitlePageLayout } from '~src/pages/TitlePageLayout'
import { ProtectedRoute } from '~src/router/ProtectedRoute'
import { ROUTES } from '~src/router/routes/index'
import { SuspenseLoader } from '~src/router/SuspenseLoader'

const SearchPage = lazy(() => import('~src/pages/search/view').then((m) => ({ default: m.View })))
const Profile = lazy(() => import('~src/pages/profile/view').then((m) => ({ default: m.View })))
const EditProfile = lazy(() => import('~src/pages/profile/edit').then((m) => ({ default: m.Edit })))
const ToolAddPage = lazy(() => import('~src/pages/tools/add').then((m) => ({ default: m.Add })))
const ToolEditPage = lazy(() => import('~src/pages/tools/edit').then((m) => ({ default: m.Edit })))
const BookingsPage = lazy(() => import('~src/pages/bookings/view').then((m) => ({ default: m.View })))
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
      {
        element: <DashboardLayout />,
        children: [
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
                path: ROUTES.BOOKINGS.PETITIONS,
                element: (
                  <SuspenseLoader>
                    <BookingsPage />
                  </SuspenseLoader>
                ),
              },
              {
                path: ROUTES.BOOKINGS.REQUESTS,
                element: (
                  <SuspenseLoader>
                    <BookingsPage />
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
        ],
      },
    ],
  },
]

export const useDashboardRoutes = () => ({
  element: <Layout />,
  children: DashboardRoutesElements,
})
