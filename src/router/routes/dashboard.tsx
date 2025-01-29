import { SearchPage } from '~src/pages/search/SearchPage'
import { Profile } from '~src/pages/profile/Profile'
import { EditProfile } from '~src/pages/profile/EditProfile'
import { ToolAddPage } from '~src/pages/tools/ToolAddPage'
import { ToolEditPage } from '~src/pages/tools/ToolEditPage'
import { UserBookingsPage } from '~src/pages/bookings/UserBookingsPage'
import { UserRatingsPage } from '~src/pages/ratings/UserRatingsPage'
import { UsersListPage } from '~src/pages/users/UsersListPage'
import { ToolsListPage } from '~src/pages/tools/ToolsListPage'
import { ToolDetailPage } from '~src/pages/tools/ToolDetailPage'
import { UserDetail } from '~src/pages/users/UserDetail'
import { ProtectedRoute } from '~src/router/ProtectedRoute'
import { FormLayout } from '~src/pages/FormLayout'
import { TitlePageLayout } from '~src/pages/TitlePageLayout'

import { ROUTES } from '~src/router/routes/index'
import { Layout } from '~src/pages/Layout'

const DashboardRoutesElements = [
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
]

export const useDashboardRoutes = () => ({
  element: <Layout />,
  children: DashboardRoutesElements,
})
