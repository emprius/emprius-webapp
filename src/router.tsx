import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './features/home/HomePage';
import { SearchPage } from './features/tools/pages/SearchPage';
import { ToolsListPage } from './features/tools/pages/ToolsListPage';
import { ToolDetailPage } from './features/tools/pages/ToolDetailPage';
import { NewToolPage } from './features/tools/pages/NewToolPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ProfilePage } from './features/user/pages/ProfilePage';
import { NotFoundPage } from './features/error/NotFoundPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { AuthLayout } from './features/auth/components/AuthLayout';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'tools',
        children: [
          {
            index: true,
            element: <ToolsListPage />,
          },
          {
            path: ':id',
            element: <ToolDetailPage />,
          },
          {
            path: 'new',
            element: (
              <ProtectedRoute>
                <NewToolPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
