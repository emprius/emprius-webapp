import { Box, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '~components/Layout/Footer'
import { Navbar } from '~components/Navbar/Navbar'
import { ScrollToTop } from '~components/Layout/ScrollToTop'
import { ErrorBoundary } from '~src/pages/ErrorBoundary'

export const Layout = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <Box minH='100vh' px={0} display='flex' flexDirection='column' bg={bgColor}>
      <ScrollToTop />
      <Navbar />
      <Box flex={1} px={0}>
        {/*lalalala*/}
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </Box>
      <Footer />
    </Box>
  )
}
