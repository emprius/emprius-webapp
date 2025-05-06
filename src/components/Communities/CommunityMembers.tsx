import React from 'react'
import {
  Button,
  Flex,
  Heading,
  Grid,
  GridItem,
  useDisclosure,
  Badge,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  HStack,
} from '@chakra-ui/react'
import { FiUserPlus, FiUserMinus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { icons } from '~theme/icons'
import { UserCard } from '~components/Users/Card'
import { useCommunityDetail, useCommunityUsers, useRemoveCommunityUser } from '~components/Communities/queries'
import { useAuth } from '~components/Auth/AuthContext'
import { InviteUserModal } from '~components/Communities/InviteUserModal'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { useParams } from 'react-router-dom'

export const CommunityMembers: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: community } = useCommunityDetail(id!)
  const isOwner = community?.ownerId === user?.id
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: usersData, isLoading: isLoadingUsers } = useCommunityUsers(id!)
  const toast = useToast()
  const { mutateAsync: removeUser, isPending: isRemoving } = useRemoveCommunityUser()

  // State for remove user confirmation dialog
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = React.useState(false)
  const [userToRemove, setUserToRemove] = React.useState<{ id: string; name?: string }>()
  const cancelRef = React.useRef<HTMLButtonElement>(null)

  // Handle opening the remove user dialog
  const handleRemoveClick = (userId: string, userName?: string) => {
    setUserToRemove({ id: userId, name: userName })
    setIsRemoveDialogOpen(true)
  }

  // Handle removing a user from the community
  const handleRemoveUser = async () => {
    if (!userToRemove || !id) return

    try {
      await removeUser({ communityId: id, userId: userToRemove.id })
      toast({
        title: t('communities.user_removed'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: String(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsRemoveDialogOpen(false)
      setUserToRemove(undefined)
    }
  }

  return (
    <>
      <Flex justify='space-between' align='center' mb={4}>
        <Heading size='md'>{t('communities.members')}</Heading>

        {isOwner && (
          <Button leftIcon={<FiUserPlus />} colorScheme='primary' onClick={onOpen}>
            {t('communities.invite_user', { defaultValue: 'Invite user' })}
          </Button>
        )}
      </Flex>

      {isLoadingUsers ? (
        <LoadingSpinner />
      ) : !usersData || usersData.length === 0 ? (
        <ElementNotFound
          icon={icons.users}
          title={t('communities.no_members')}
          desc={t('communities.no_members_desc')}
        />
      ) : (
        <>
          {usersData.map((member) => (
            <HStack key={member.id}>
              <UserCard
                userId={member.id}
                placeholderData={member}
                maxW={'300px'}
                borderWidth={0}
                badge={community?.ownerId === member.id && t('communities.admin')}
              />
              {isOwner && community?.ownerId !== member.id && (
                <IconButton
                  aria-label={t('communities.remove_user')}
                  icon={<FiUserMinus />}
                  colorScheme='red'
                  variant='ghost'
                  isLoading={isRemoving && userToRemove?.id === member.id}
                  onClick={() => handleRemoveClick(member.id, member.name)}
                />
              )}
            </HStack>
          ))}
        </>
      )}
      {community && <InviteUserModal isOpen={isOpen} onClose={onClose} communityId={community.id} />}

      {/* Remove user confirmation dialog */}
      <AlertDialog
        isOpen={isRemoveDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsRemoveDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {t('communities.remove_user')}
            </AlertDialogHeader>

            <AlertDialogBody>{t('communities.remove_user_confirm')}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsRemoveDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme='red' onClick={handleRemoveUser} ml={3} isLoading={isRemoving}>
                {t('communities.remove_user')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
