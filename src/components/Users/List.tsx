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
import { SearchTermBar } from '~components/Layout/SearchTerm/SearchTermBar'
import { SearchTermProvider, useSearchTerm } from '~components/Layout/SearchTerm/SearchTermContext'

export const UsersListNavigator = () => {
  const { t } = useTranslation()
  const [page, setPage] = React.useState(0)

  return (
    <SearchTermProvider>
      <UsersListWithSearch page={page} setPage={setPage} />
    </SearchTermProvider>
  )
}

const UsersListWithSearch = ({
  page,
  setPage,
}: {
  page: number
  setPage: (page: number | ((prevPage: number) => number)) => void
}) => {
  const { t } = useTranslation()
  const { debouncedSearch: username } = useSearchTerm()
  const { data, isLoading } = useUsers({ page, username })

  const users = data?.users

  return (
    <Flex direction={'column'} gap={6} w='100%'>
      <SearchTermBar placeholder={t('communities.search_placeholder')} />
      <UsersList users={users} isLoading={isLoading} />
      <HStack justify='center' spacing={4}>
        <Button leftIcon={<FiChevronLeft />} onClick={() => setPage((p) => Math.max(0, p - 1))} isDisabled={page === 0}>
          {t('common.previous')}
        </Button>
        <Text>
          {t('common.page')} {page + 1}
        </Text>
        <Button
          rightIcon={<FiChevronRight />}
          onClick={() => setPage((p) => p + 1)}
          isDisabled={!users || users.length < 16} // API returns 16 items per page
        >
          {t('common.next')}
        </Button>
      </HStack>
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
