import React from 'react'
import { Button, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDefaultUserCommunities, useUserCommunities } from './queries'
import { CommunityCard } from './Card'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ROUTES } from '~src/router/routes'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { useAuth } from '~components/Auth/AuthContext'

export const CommunitiesList: React.FC = () => {
  const { t } = useTranslation()
  const { isLoading, isError, error, data } = useDefaultUserCommunities()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ElementNotFound icon={icons.users} title={t('common.error')} desc={t('common.something_went_wrong')} />
  }

  if (!data || data?.length === 0) {
    return (
      <ElementNotFound
        icon={icons.users}
        title={t('communities.no_communities')}
        desc={t('communities.no_communities_desc')}
      />
    )
  }

  return (
    <Stack spacing={6}>
      <ResponsiveSimpleGrid>
        {data.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </ResponsiveSimpleGrid>
    </Stack>
  )
}
