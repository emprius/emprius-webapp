import { Box, Container, Image, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'

import { ROUTES } from '~src/router/routes'
import logo from '/assets/logos/logo.png'
export const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const contentBgColor = useColorModeValue('white', 'gray.800')

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return (
    <Box minH='100vh' display='flex' alignItems='center' bg={bgColor} py={4}>
      <Container maxW='container.sm'>
        <Box mb={8} display='flex' justifyContent='center'>
          <Image src={logo} alt='Emprius' h='60px' objectFit='contain' />
        </Box>
        <Box bg={contentBgColor} p={8} borderRadius='lg' boxShadow='sm'>
          <Outlet />
        </Box>
      </Container>
    </Box>
  )
}
