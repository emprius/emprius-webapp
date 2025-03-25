import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { useUserCommunities } from '~components/communities/queries'
import { useAuth } from '~components/Auth/AuthContext'
import { CommunityCard } from '~components/communities/Card'

export const UserCommunities = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { user: currentUser } = useAuth()
  const isCurrentUser = id === currentUser?.id
  
  const { data: communities, isLoading, isError } = useUserCommunities(id!)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (isError) {
    return (
      <ElementNotFound
        icon={icons.users}
        title={t('common.error')}
        desc={t('common.something_went_wrong')}
      />
    )
  }
  
  if (!communities || communities.length === 0) {
    return (
      <ElementNotFound
        icon={icons.users}
        title={isCurrentUser ? t('communities.no_communities') : t('communities.user_no_communities')}
        desc={isCurrentUser ? t('communities.no_communities_desc') : t('communities.user_no_communities_desc')}
      />
    )
  }
  
  return (
    <Stack spacing={6}>
      <Stack spacing={4}>
        {communities.map(community => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </Stack>
    </Stack>
  )
}
