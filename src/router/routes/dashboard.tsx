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
const BookingsPage = lazy(() => import('~src/pages/bookings/list').then((m) => ({ default: m.List })))
const BookingDetailPage = lazy(() => import('~src/pages/bookings/detail').then((m) => ({ default: m.Detail })))
const UserRatingsPage = lazy(() => import('~src/pages/ratings/view').then((m) => ({ default: m.View })))
const UsersListPage = lazy(() => import('~src/pages/users/list').then((m) => ({ default: m.List })))
const ToolsListPage = lazy(() => import('~src/pages/tools/list').then((m) => ({ default: m.List })))

// Communities pages
const CommunityDetailPage = lazy(() => import('~src/pages/communities/detail').then((m) => ({ default: m.Detail })))
const CommunityNewPage = lazy(() => import('~src/pages/communities/new').then((m) => ({ default: m.New })))
const CommunityEditPage = lazy(() => import('~src/pages/communities/edit').then((m) => ({ default: m.Edit })))
const CommunitiesViewPage = lazy(() => import('~src/pages/communities/view').then((m) => ({ default: m.View })))

// Messages pages
const MessagesConversationsPage = lazy(() =>
  import('~src/pages/messages/conversations').then((m) => ({ default: m.View }))
)
const MessagesChatPage = lazy(() => import('~src/pages/messages/chat').then((m) => ({ default: m.View })))

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
        path: ROUTES.RATINGS.HISTORY,
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
      {
        path: ROUTES.BOOKINGS.DETAIL,
        element: (
          <SuspenseLoader>
            <BookingDetailPage />
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
      {
        path: ROUTES.COMMUNITIES.NEW,
        element: (
          <SuspenseLoader>
            <CommunityNewPage />
          </SuspenseLoader>
        ),
      },
      {
        path: ROUTES.COMMUNITIES.EDIT,
        element: (
          <SuspenseLoader>
            <CommunityEditPage />
          </SuspenseLoader>
        ),
      },
    ],
  },
]

const CommunityElements = [
  {
    path: ROUTES.COMMUNITIES.DETAIL,
    element: (
      <SuspenseLoader>
        <CommunityDetailPage />
      </SuspenseLoader>
    ),
  },
  {
    path: ROUTES.COMMUNITIES.TABS.TOOLS,
    element: (
      <SuspenseLoader>
        <CommunityDetailPage />
      </SuspenseLoader>
    ),
  },
  {
    element: <TitlePageLayout />,
    children: [
      {
        path: ROUTES.COMMUNITIES.LIST,
        element: (
          <SuspenseLoader>
            <CommunitiesViewPage />
          </SuspenseLoader>
        ),
      },
      {
        path: ROUTES.COMMUNITIES.INVITES,
        element: (
          <SuspenseLoader>
            <CommunitiesViewPage />
          </SuspenseLoader>
        ),
      },
    ],
  },
]

const UserElements = [
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
]

const MessageElements = [
  {
    element: <TitlePageLayout />,
    children: [
      {
        path: ROUTES.MESSAGES.CONVERSATIONS,
        element: (
          <SuspenseLoader>
            <MessagesConversationsPage />
          </SuspenseLoader>
        ),
      },
    ],
  },
  {
    path: ROUTES.MESSAGES.CHAT,
    element: (
      <SuspenseLoader>
        <MessagesChatPage />
      </SuspenseLoader>
    ),
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
          ...CommunityElements,
          ...UserElements,
          ...MessageElements,
        ],
      },
    ],
  },
]

export const useDashboardRoutes = () => ({
  element: <Layout />,
  children: DashboardRoutesElements,
})
