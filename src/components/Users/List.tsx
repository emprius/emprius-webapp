import { useTranslation } from 'react-i18next'
import React from 'react'
import { Button, HStack, Text } from '@chakra-ui/react'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { UserCard } from '~components/Users/Card'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { useUsers } from '~components/Users/queries'

export const UsersList = () => {
  const { t } = useTranslation()
  const [page, setPage] = React.useState(0)

  const { data, isLoading } = useUsers({ page })

  if (isLoading || !data) return <LoadingSpinner />

  const { users: usersList } = data

  return (
    <>
      {usersList.length === 0 ? (
        <ElementNotFound icon={icons.users} title={t('user.no_users_found')} desc={t('user.no_users_found_desc')} />
      ) : (
        <>
          <ResponsiveSimpleGrid>
            {usersList.map((user) => (
              <UserCard key={user.id} userId={user.id} placeholderData={user} />
            ))}
          </ResponsiveSimpleGrid>

          <HStack justify='center' mt={6} spacing={4}>
            <Button
              leftIcon={<FiChevronLeft />}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              isDisabled={page === 0}
            >
              {t('common.previous')}
            </Button>
            <Text>
              {t('common.page')} {page + 1}
            </Text>
            <Button
              rightIcon={<FiChevronRight />}
              onClick={() => setPage((p) => p + 1)}
              isDisabled={!usersList || usersList.length < 16} // API returns 16 items per page
            >
              {t('common.next')}
            </Button>
          </HStack>
        </>
      )}
    </>
  )
}
