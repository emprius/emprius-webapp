import { Box, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Footer } from '~components/Layout/Footer'
import { OfflineBanner } from '~components/Layout/OfflineBanner'
import { PWABanner } from '~components/Layout/PWABanner'
import { ScrollToTop } from '~components/Layout/ScrollToTop'
import { Navbar } from '~components/Navbar/Navbar'
import { BottomNav } from '~src/pages/BottomNav'
import { ErrorBoundary } from '~src/pages/ErrorBoundary'
import { useIsDashboardLayout } from '~src/pages/DashboardLayout'

export const Layout = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { isAuthenticated } = useAuth()
  const isDashboardLayout = useIsDashboardLayout()

  return (
    <Box minH='100vh' px={0} display='flex' flexDirection='column' bg={bgColor}>
      <ScrollToTop />
      <PWABanner />
      <OfflineBanner />
      <Navbar />
      <Box flex={1}>
        <ErrorBoundary>
          <Outlet />
          {isAuthenticated && !isDashboardLayout && <BottomNav />}
        </ErrorBoundary>
      </Box>
      <Footer />
    </Box>
  )
}
