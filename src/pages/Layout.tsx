import { Box, Hide, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '~components/Layout/Footer'
import { OfflineBanner } from '~components/Layout/OfflineBanner'
import { PWABanner } from '~components/Layout/PWABanner'
import { ScrollToTop } from '~components/Layout/ScrollToTop'
import { Navbar } from '~components/Navbar/Navbar'
import { BottomNav } from '~src/pages/BottomNav'
import { ErrorBoundary } from '~src/pages/ErrorBoundary'

export const Layout = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <Box minH='100vh' px={0} display='flex' flexDirection='column' bg={bgColor}>
      <ScrollToTop />
      <PWABanner />
      <OfflineBanner />
      <Navbar />
      <Box flex={1}>
        <ErrorBoundary>
          <Outlet />
          <Hide above='md'>
            <BottomNav />
          </Hide>
        </ErrorBoundary>
      </Box>
      <Footer />
    </Box>
  )
}
