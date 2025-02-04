import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '~components/Auth/AuthContext'
import { InfoProvider } from '~components/InfoProviders/InfoContext'
import { PendingActionsProvider } from '~components/InfoProviders/PendingActionsProvider'
import { SearchProvider } from '~components/Search/SearchContext'
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
              <SearchProvider>
                <AppRoutes />
              </SearchProvider>
            </PendingActionsProvider>
          </InfoProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
