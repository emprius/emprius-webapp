import { Box, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Footer } from '~components/Layout/Footer'
import { OfflineBanner } from '~components/Layout/Banners/OfflineBanner'
import { PWABanner } from '~components/Layout/Banners/PWABanner'
import { ScrollToTop } from '~components/Layout/ScrollToTop'
import { Navbar } from '~components/Navbar/Navbar'
import { BottomNav } from '~components/Layout/BottomNav'
import { useIsDashboardBigLayout } from '~src/pages/DashboardLayout'
import { PWAUpdateBanner } from '~components/Layout/Banners/PWAUpdateBanner'

export const Layout = ({ hideFooter = false }: { hideFooter: boolean }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { isAuthenticated } = useAuth()
  const isDashboardLayout = useIsDashboardBigLayout()

  return (
    <Box minH='100vh' px={0} display='flex' flexDirection='column' bg={bgColor}>
      <ScrollToTop />
      <PWABanner />
      <OfflineBanner />
      <PWAUpdateBanner />
      <Navbar />
      <Box flex={1}>
        <Outlet />
        {isAuthenticated && !isDashboardLayout && <BottomNav />}
      </Box>
      {!hideFooter && <Footer />}
    </Box>
  )
}
