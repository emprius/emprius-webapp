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
  useColorModeValue,
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
import { SearchAndPagination } from '~components/Layout/Search/SearchAndPagination'
import { DebouncedSearchBar } from '~components/Layout/Search/DebouncedSearchBar'
import { RoutedPagination } from '~components/Layout/Pagination/Pagination'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { Community } from '~components/Communities/types'

export const CommunityMembers: React.FC = () => (
  <SearchAndPagination>
    <CommunityMembersPaginated />
  </SearchAndPagination>
)

const CommunityMembersPaginated: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: community, isLoading, error, isError } = useCommunityDetail(id!)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuth()
  const isOwner = community?.ownerId === user?.id
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!id || isError || !community) {
    return <ErrorComponent error={error ?? t('common.something_went_wrong')} />
  }

  return (
    <>
      <Flex justify='space-between' align='center' mb={4} gap={3} wrap={'wrap'}>
        <HStack bg={bgColor} borderColor={borderColor} borderRadius='2xl' flex={1} maxW='600px' w='full'>
          <DebouncedSearchBar placeholder={t('communities.search_placeholder')} />
        </HStack>
        {isOwner && (
          <Button leftIcon={<FiUserPlus />} colorScheme='primary' onClick={onOpen}>
            {t('communities.invite_user', { defaultValue: 'Invite user' })}
          </Button>
        )}
      </Flex>
      <CommunityUsersList id={id} community={community} />
      <InviteUserModal isOpen={isOpen} onClose={onClose} communityId={community.id} />
    </>
  )
}

const CommunityUsersList = ({ id, community }: { id: string; community: Community }) => {
  const { t } = useTranslation()
  const { data, isLoading } = useCommunityUsers(id!)
  const toast = useToast()
  const { mutateAsync: removeUser, isPending: isRemoving } = useRemoveCommunityUser()
  const { user } = useAuth()
  const isOwner = community?.ownerId === user?.id

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

  if (isLoading) {
    return <LoadingSpinner />
  }

  const usersData = data?.users || []

  if (!usersData || usersData.length === 0) {
    return (
      <ElementNotFound icon={icons.users} title={t('communities.no_members')} desc={t('communities.no_members_desc')} />
    )
  }

  return (
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
      <RoutedPagination pagination={data.pagination} />
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
