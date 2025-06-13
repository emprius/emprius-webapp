import React from 'react'
import { Stack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useDefaultUserCommunities } from './queries'
import { CommunityCard } from './Card'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'
import { SearchAndPagination } from '~components/Layout/Search/SearchAndPagination'

export const CommunitiesList: React.FC = () => (
  <SearchAndPagination>
    <CommunitiesListPaginated />
  </SearchAndPagination>
)

const CommunitiesListPaginated: React.FC = () => {
  const { t } = useTranslation()
  const { isLoading, isError, error, data } = useDefaultUserCommunities()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ElementNotFound icon={icons.users} title={t('common.error')} desc={t('common.something_went_wrong')} />
  }

  if (!data?.communities?.length) {
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
        {data.communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </ResponsiveSimpleGrid>
      <RoutedPagination pagination={data.pagination} />
    </Stack>
  )
}
