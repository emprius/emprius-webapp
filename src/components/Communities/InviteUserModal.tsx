import React, { useState, useEffect } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
  Text,
  Box,
  Flex,
} from '@chakra-ui/react'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { icons } from '~theme/icons'
import { useTranslation } from 'react-i18next'
import { useInviteUserToCommunity } from './queries'
import { useUsers } from '~components/Users/queries'
import { UserProfile, UserProfileDTO } from '~components/Users/types'
import { Avatar } from '~components/Images/Avatar'
import { useAuth } from '~components/Auth/AuthContext'

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
  communityId: string
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose, communityId }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserProfileDTO | null>(null)
  const { user: selfUser } = useAuth()

  // Implement our own debounce with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Use the updated users query with username search parameter
  const { data, isLoading } = useUsers({ page: 0, username: debouncedSearch })
  const { mutateAsync: inviteUser, isPending } = useInviteUserToCommunity()

  // Users are now filtered server-side based on the username parameter
  const filteredUsers = data?.users.filter((user) => user.id !== selfUser.id) || []

  const handleInvite = async () => {
    if (!selectedUser) return

    try {
      await inviteUser({ communityId, userId: selectedUser.id })
      toast({
        title: t('communities.user_invited'),
        status: 'success',
        duration: 3000,
      })
      onClose()
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.something_went_wrong'),
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('communities.invite_user')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>{t('communities.search_user')}</FormLabel>
              <Input
                placeholder={t('communities.search_placeholder')}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </FormControl>

            <Box maxH='300px' overflowY='auto'>
              {isLoading ? (
                <LoadingSpinner />
              ) : filteredUsers.length > 0 ? (
                <Stack spacing={2}>
                  {filteredUsers.map((user) => (
                    <Flex
                      key={user.id}
                      p={2}
                      borderRadius='md'
                      cursor='pointer'
                      bg={selectedUser?.id === user.id ? 'primary.50' : 'transparent'}
                      _hover={{ bg: 'gray.100' }}
                      _dark={{
                        bg: selectedUser?.id === user.id ? 'primary.900' : 'transparent',
                        _hover: { bg: 'gray.700' },
                      }}
                      onClick={() => setSelectedUser(user)}
                      align='center'
                    >
                      <Box marginRight={3}>
                        <Avatar username={user.name} avatarHash={user.avatarHash} size='sm' />
                      </Box>
                      <Text fontWeight='medium'>{user.name}</Text>
                    </Flex>
                  ))}
                </Stack>
              ) : (
                <ElementNotFound
                  icon={icons.users}
                  title={t('communities.no_users_found')}
                  desc={t('communities.no_users_found_desc')}
                />
              )}
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant='ghost' mr={3} onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button colorScheme='primary' onClick={handleInvite} isDisabled={!selectedUser} isLoading={isPending}>
            {t('communities.invite')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
