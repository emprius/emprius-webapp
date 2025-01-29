import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '~components/Auth/AuthContext'
import { InfoProvider } from '~components/Info/InfoContext'
import { PendingActionsProvider } from '~components/Layout/PendingActionsProvider'
import theme from '~theme/theme'
import { AppRoutes } from './router/router'
import queryClient from './services/queryClient'

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <InfoProvider>
            <PendingActionsProvider>
              <AppRoutes />
            </PendingActionsProvider>
          </InfoProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
