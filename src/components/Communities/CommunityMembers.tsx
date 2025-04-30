import React from 'react'
import {
  Button,
  Flex,
  Heading,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { FiUserPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { icons } from '~theme/icons'
import { UserCard } from '~components/Users/Card'
import { useCommunityDetail, useCommunityUsers } from '~components/Communities/queries'
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

  return (
    <>
      <Flex justify='space-between' align='center' mb={4}>
        <Heading size='md'>{t('communities.members')}</Heading>

        {isOwner && (
          <Button leftIcon={<FiUserPlus />} colorScheme='primary' size='sm' onClick={onOpen}>
            {t('communities.invite_user')}
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
        <Stack spacing={4}>
          {usersData.map((user) => (
            <UserCard key={user.id} userId={user.id} placeholderData={user} direction='row' />
          ))}
        </Stack>
      )}
      
      {community && (
        <InviteUserModal isOpen={isOpen} onClose={onClose} communityId={community.id} />
      )}
    </>
  )
}
