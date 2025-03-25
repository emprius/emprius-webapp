import React from 'react'
import { Button, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCommunities } from './queries'
import { CommunityCard } from './Card'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ROUTES } from '~src/router/routes'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { useAuth } from '~components/Auth/AuthContext'

export const CommunitiesList: React.FC = () => {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useCommunities()
  const bgColor = useColorModeValue('white', 'gray.800')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ElementNotFound icon={icons.users} title={t('common.error')} desc={t('common.something_went_wrong')} />
  }

  if (!data?.communities || data.communities.length === 0) {
    return (
      <Stack spacing={6} p={6} bg={bgColor} borderRadius='lg' align='center'>
        <ElementNotFound
          icon={icons.users}
          title={t('communities.no_communities')}
          desc={t('communities.no_communities_desc')}
        />
        <Button as={RouterLink} to={ROUTES.COMMUNITIES.NEW} leftIcon={<FiPlus />} colorScheme='primary'>
          {t('communities.create_community')}
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={6}>
      <Flex justify='space-between' align='center'>
        <Heading size='md'>{t('communities.your_communities')}</Heading>
        <Button as={RouterLink} to={ROUTES.COMMUNITIES.NEW} leftIcon={<FiPlus />} colorScheme='primary' size='sm'>
          {t('communities.create_community')}
        </Button>
      </Flex>

      <ResponsiveSimpleGrid>
        {data.communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </ResponsiveSimpleGrid>
    </Stack>
  )
}
