import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { AuthProvider } from '~components/Auth/AuthContext'
import { InfoProvider } from '~components/Auth/InfoContext'
import theme from '~theme/theme'
import { AppRoutes } from './router/router'
import queryClient from '~src/services/queryClient'

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <InfoProvider>
            <AppRoutes />
          </InfoProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
