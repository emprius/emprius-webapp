import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Divider, HStack, Stack, useColorModeValue } from '@chakra-ui/react'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { useUserCommunities } from '~components/Communities/queries'
import { useAuth } from '~components/Auth/AuthContext'
import { CommunityCardLittle } from '~components/Communities/Card'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'
import { SearchAndPagination } from '~components/Layout/Search/SearchAndPagination'
import { DebouncedSearchBar } from '~components/Layout/Search/DebouncedSearchBar'

export const UserCommunities = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  return (
    <SearchAndPagination>
      <HStack bg={bgColor} borderColor={borderColor} borderRadius='2xl' flex={1} w='full'>
        <DebouncedSearchBar
          placeholder={t('tools.filter_tools', { defaultValue: 'Filter by tool name or description' })}
        />
      </HStack>
      <UserCommunitiesPaginated />
    </SearchAndPagination>
  )
}

const UserCommunitiesPaginated = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { user: currentUser } = useAuth()
  const isCurrentUser = id === currentUser?.id

  const { data, isLoading, isError } = useUserCommunities(id!)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ElementNotFound icon={icons.users} title={t('common.error')} desc={t('common.something_went_wrong')} />
  }

  if (!data.communities.length) {
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
        {data.communities.map((community) => (
          <>
            <CommunityCardLittle key={community.id} id={community.id} />
            <Divider />
          </>
        ))}
      </Stack>
      <RoutedPagination pagination={data.pagination} />
    </Stack>
  )
}
