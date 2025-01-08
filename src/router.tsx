import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="tools">
          <Route index element={<ToolsListPage />} />
          <Route path=":id" element={<ToolDetailPage />} />
          <Route
            path="new"
            element={
              <ProtectedRoute>
                <NewToolPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
