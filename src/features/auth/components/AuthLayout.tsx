import { Box, Container, Image, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const contentBgColor = useColorModeValue('white', 'gray.800')

  if (isAuthenticated) {
    // todo(konv1): use route constants
    return <Navigate to='/' replace />
  }

  return (
    <Box minH='100vh' display='flex' alignItems='center' bg={bgColor}>
      <Container maxW='container.sm'>
        <Box mb={8} display='flex' justifyContent='center'>
          <Image src='/assets/logos/logo.png' alt='Emprius' h='60px' objectFit='contain' />
        </Box>
        <Box bg={contentBgColor} p={8} borderRadius='lg' boxShadow='sm'>
          <Outlet />
        </Box>
      </Container>
    </Box>
  )
}
