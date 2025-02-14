import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { AuthProvider } from '~components/Auth/AuthContext'
import { InfoProvider } from '~components/InfoProviders/InfoContext'
import { PendingActionsProvider } from '~components/InfoProviders/PendingActionsProvider'
import { TitleProvider } from '~components/Layout/TitleContext'
import { SearchProvider } from '~components/Search/SearchContext'
import theme from '~theme/theme'
import { AppRoutes } from './router/router'
import queryClient from './services/queryClient'

export const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AppProviders />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

const AppProviders = () => (
  <AuthProvider>
    <InfoProvider>
      <PendingActionsProvider>
        <SearchProvider>
          <AppRoutes />
        </SearchProvider>
      </PendingActionsProvider>
    </InfoProvider>
  </AuthProvider>
)

/**
 * These providers depend on the navigation, so it should be placed inside the router
 */
export const NavigationDependingProviders = ({ children }: PropsWithChildren<{}>) => (
  <TitleProvider>{children}</TitleProvider>
)
