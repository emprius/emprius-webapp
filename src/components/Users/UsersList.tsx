import { useTranslation } from 'react-i18next'
import React from 'react'
import { Box, Button, HStack, SimpleGrid, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { users } from '~src/services/api'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { FiChevronLeft, FiChevronRight, FiUsers } from 'react-icons/fi'
import { UserCard } from '~components/Users/UserCard'

export const UsersList = () => {
  const { t } = useTranslation()
  const [page, setPage] = React.useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => users.getList(page),
  })

  if (isLoading || !data) return <LoadingSpinner />

  const { users: usersList } = data

  return (
    <>
      {usersList.length === 0 ? (
        <Box textAlign='center' py={10}>
          <Box as={FiUsers} boxSize={12} color='gray.400' mx='auto' mb={4} />
          <Text fontSize='xl' fontWeight='medium' color='gray.500' mb={2}>
            {t('user.no_users_found')}
          </Text>
          <Text color='gray.400'>{t('user.no_users_found_desc')}</Text>
        </Box>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {usersList.map((user) => (
              <UserCard key={user.id} userId={user.id} placeholderData={user} />
            ))}
          </SimpleGrid>

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
