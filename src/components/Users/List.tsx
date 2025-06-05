import { useTranslation } from 'react-i18next'
import React from 'react'
import { Button, Flex, HStack, Text } from '@chakra-ui/react'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { UserCard } from '~components/Users/Card'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { useUsers } from '~components/Users/queries'
import { UserProfileDTO } from '~components/Users/types'
import { DebouncedSearchBar } from '~components/Layout/Search/DebouncedSearchBar'
import { DebouncedSearchProvider, useDebouncedSearch } from '~components/Layout/Search/DebouncedSearchContext'
import { SearchAndPagination } from '~components/Layout/Search/SearchAndPagination'
import { usePagination, useRoutedPagination } from '~components/Layout/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'

export const UsersListNavigator = () => {
  return (
    <SearchAndPagination>
      <UsersListWithSearch />
    </SearchAndPagination>
  )
}

const UsersListWithSearch = () => {
  const { t } = useTranslation()
  const { debouncedSearch: username } = useDebouncedSearch()
  const { page } = useRoutedPagination()
  const { data, isLoading } = useUsers({ page, username })

  const users = data?.users

  return (
    <Flex direction={'column'} gap={6} w='100%'>
      <DebouncedSearchBar placeholder={t('communities.search_placeholder')} />
      <UsersList users={users} isLoading={isLoading} />
      <RoutedPagination pagination={data?.pagination} />
    </Flex>
  )
}

const UsersList = ({ users, isLoading }: { users: UserProfileDTO[]; isLoading: boolean }) => {
  const { t } = useTranslation()
  if (isLoading || !users) return <LoadingSpinner />

  if (users.length === 0)
    return <ElementNotFound icon={icons.users} title={t('user.no_users_found')} desc={t('user.no_users_found_desc')} />

  return (
    <>
      <ResponsiveSimpleGrid>
        {users.map((user) => (
          <UserCard key={user.id} userId={user.id} placeholderData={user} />
        ))}
      </ResponsiveSimpleGrid>
    </>
  )
}
