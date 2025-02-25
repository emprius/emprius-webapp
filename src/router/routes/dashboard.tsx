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

const RatingElements = [
  {
    element: <TitlePageLayout />,
    children: [
      {
        path: ROUTES.RATINGS.PENDING,
        element: (
          <SuspenseLoader>
            <UserRatingsPage />
          </SuspenseLoader>
        ),
      },
      {
        path: ROUTES.RATINGS.SUBMITTED,
        element: (
          <SuspenseLoader>
            <UserRatingsPage />
          </SuspenseLoader>
        ),
      },
      {
        path: ROUTES.RATINGS.RECEIVED,
        element: (
          <SuspenseLoader>
            <UserRatingsPage />
          </SuspenseLoader>
        ),
      },
    ],
  },
]

const BookingElements = [
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
    ],
  },
]

const DashboardForms = [
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
]

const DashboardRoutesElements = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
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
            path: ROUTES.TOOLS.LIST,
            element: (
              <SuspenseLoader>
                <ToolsListPage />
              </SuspenseLoader>
            ),
          },
          ...DashboardForms,
          ...BookingElements,
          ...RatingElements,
          {
            element: <TitlePageLayout />,
            children: [
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
        ],
      },
    ],
  },
]

export const useDashboardRoutes = () => ({
  element: <Layout />,
  children: DashboardRoutesElements,
})
