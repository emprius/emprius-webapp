import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { AuthProvider } from '~components/Auth/AuthContext'
import { InfoProvider } from '~components/Layout/Contexts/InfoContext'
import { PendingActionsProvider } from '~components/Layout/Contexts/PendingActionsProvider'
import { PWAUpdateProvider } from '~components/Layout/Contexts/PWAUpdateProvider'
import { TitleProvider } from '~components/Layout/Contexts/TitleContext'
import { SearchProvider } from '~components/Search/SearchContext'
import { UnreadMessagesProvider } from '~components/Messages/UnreadMessagesProvider'
import theme from '~theme/theme'
import { AppRoutes } from './router/router'
import queryClient from './services/queryClient'
import { ErrorBoundaries } from '~src/pages/ErrorBoundary'

export const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        {/* Top level error boundaries to catch errors in the whole app */}
        <ErrorBoundaries>
          <AppProviders />
        </ErrorBoundaries>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

const AppProviders = () => (
  <PWAUpdateProvider>
    <AuthProvider>
      <InfoProvider>
        <PendingActionsProvider>
          <UnreadMessagesProvider>
            <SearchProvider>
              <AppRoutes />
            </SearchProvider>
          </UnreadMessagesProvider>
        </PendingActionsProvider>
      </InfoProvider>
    </AuthProvider>
  </PWAUpdateProvider>
)

/**
 * These providers depend on the navigation, so it should be placed inside the router
 */
export const NavigationDependingProviders = ({ children }: PropsWithChildren<{}>) => (
  <TitleProvider>{children}</TitleProvider>
)
