import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUserProfile } from '~components/Users/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { UserProfile } from '~components/Users/Profile'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { useTranslation } from 'react-i18next'
import { MainContainer } from '~components/Layout/LayoutComponents'
import { Box, useColorModeValue } from '@chakra-ui/react'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'
import { ROUTES } from '~src/router/routes'
import { UserTools } from '~components/Users/UserTools'
import { UserRatings } from '~components/Users/UserRatings'

export const Detail = () => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const {
    data: userData,
    isError: isUserError,
    error: userError,
    isLoading: isUserLoading,
  } = useUserProfile(id, {
    enabled: !!id,
  })

  if (isUserLoading) return <LoadingSpinner />
  if (!userData || !id) {
    return <ElementNotFound icon={icons.user} title={t('user.user_not_found')} desc={t('user.user_not_found_desc')} />
  }
  if (isUserError) return <ErrorComponent error={userError} />

  const tabs: TabConfig[] = [
    {
      path: ROUTES.USERS.TABS.TOOLS.replace(':id', id),
      label: t('common.tools'),
      content: <UserTools />,
    },
    {
      path: ROUTES.USERS.TABS.RATINGS.replace(':id', id),
      label: t('common.ratings'),
      content: <UserRatings />,
    },
  ]

  return (
    <MainContainer>
      <UserProfile {...userData} />
      <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} w={'full'} mt={8}>
        <RoutedTabs tabs={tabs} defaultPath={ROUTES.USERS.TABS.TOOLS.replace(':id', id)} />
      </Box>
    </MainContainer>
  )
}
