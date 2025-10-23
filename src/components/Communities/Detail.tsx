import React, { useMemo } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCommunityDetail, useDeleteCommunity, useLeaveCommunity } from './queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ROUTES } from '~src/router/routes'
import { ServerImage } from '~components/Images/ServerImage'
import { useAuth } from '~components/Auth/AuthContext'
import { useUnreadMessageCounts } from '~components/Messages/queries'
import { BadgeCounter } from '~components/Layout/BadgeIcon'

export const CommunityDetail: React.FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const { data: community, isLoading, isError } = useCommunityDetail(id!)

  const { mutateAsync: deleteCommunity, isPending: isDeleting } = useDeleteCommunity()
  const { mutateAsync: leaveCommunity, isPending: isLeaving } = useLeaveCommunity()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const { data: unreadCounts } = useUnreadMessageCounts()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError || !community) {
    return (
      <ElementNotFound icon={icons.users} title={t('communities.not_found')} desc={t('communities.not_found_desc')} />
    )
  }

  const isOwner = community.ownerId === user?.id
  const isMember = useMemo(
    () => user?.communities?.some(({ id }) => id === community?.id),
    [user?.communities, community?.id]
  )

  const handleDelete = async () => {
    try {
      await deleteCommunity(community.id)
      toast({
        title: t('communities.deleted'),
        status: 'success',
        duration: 3000,
      })
      navigate(ROUTES.COMMUNITIES.LIST)
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.something_went_wrong'),
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleLeave = async () => {
    try {
      await leaveCommunity(community.id)
      toast({
        title: t('communities.left'),
        status: 'success',
        duration: 3000,
      })
      navigate(ROUTES.COMMUNITIES.LIST)
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
    <Box bg={bgColor} borderRadius='lg' overflow='hidden' borderWidth='1px' borderColor={borderColor} w={'full'}>
      <Box position='relative' height='200px' overflow='hidden'>
        <ServerImage
          imageId={community.image}
          alt={community.name}
          fallbackSrc='/assets/logos/tool-fallback.svg'
          objectFit='cover'
          width='100%'
          height='100%'
        />

        {isOwner && (
          <IconButton
            aria-label={t('common.edit')}
            icon={<FiEdit2 />}
            size='sm'
            position='absolute'
            top={4}
            right={4}
            as={RouterLink}
            to={ROUTES.COMMUNITIES.EDIT.replace(':id', community.id)}
          />
        )}
      </Box>

      <Box p={6}>
        <Flex justify='space-between' align='flex-start'>
          <Heading size='lg' mb={4}>
            <HStack>
              <Icon as={icons.communities} />
              <Box>{community.name}</Box>
            </HStack>
          </Heading>

          <Stack direction='row'>
            {isOwner && (
              <Button
                leftIcon={icons.delete({})}
                colorScheme='red'
                variant='outline'
                size='sm'
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                {t('communities.delete')}
              </Button>
            )}
            <VStack justify={'end'} align={'end'}>
              {!isOwner && isMember && (
                <Button colorScheme='red' variant='outline' size='sm' onClick={handleLeave} isLoading={isLeaving}>
                  {t('communities.leave')}
                </Button>
              )}
              {isMember && (
                <BadgeCounter
                  count={unreadCounts?.communities?.[id!] || 0}
                  badgeProps={{
                    top: '-4px',
                    right: '-7px',
                  }}
                >
                  <Button
                    as={RouterLink}
                    to={ROUTES.MESSAGES.COMMUNITY_CHAT.replace(':id', community.id)}
                    aria-label={t('messages.title', { defaultValue: 'Messages' })}
                    // onClick={() => navigate(ROUTES.MESSAGES.CHAT.replace(':userId', userId))}
                    leftIcon={<Icon as={icons.messages} />}
                    size='sm'
                    variant='outline'
                  >
                    {t('messages.title', { defaultValue: 'Messages' })}
                  </Button>{' '}
                </BadgeCounter>
              )}
            </VStack>
          </Stack>
        </Flex>

        <Flex direction={'column'} mb={4} gap={1}>
          <Text color='gray.500'>
            {t('communities.member_count', { defaultValue: '{{ count }} members', count: community.membersCount })}
          </Text>
          <Text color='gray.500'>
            {t('communities.tools_count', {
              defaultValue: '{{ count }} shared tools',
              count: community.toolsCount ?? 0,
            })}
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}
