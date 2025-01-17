import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { AuthProvider } from '~components/Auth/AuthContext'
import { InfoProvider } from '~components/Auth/InfoContext'
import theme from '~theme/theme'
import './i18n'
import { AppRoutes } from './router/router'

const queryClient = new QueryClient()

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
