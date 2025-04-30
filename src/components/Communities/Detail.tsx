import React from 'react'
import { Box, Button, Flex, Heading, IconButton, Stack, Text, useColorModeValue, useToast } from '@chakra-ui/react'
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

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError || !community) {
    return (
      <ElementNotFound icon={icons.users} title={t('communities.not_found')} desc={t('communities.not_found_desc')} />
    )
  }

  const isOwner = community.ownerId === user?.id

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
            {community.name}
          </Heading>

          <Stack direction='row'>
            {isOwner ? (
              <Button
                leftIcon={<FiTrash2 />}
                colorScheme='red'
                variant='outline'
                size='sm'
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                {t('communities.delete')}
              </Button>
            ) : (
              <Button colorScheme='red' variant='outline' size='sm' onClick={handleLeave} isLoading={isLeaving}>
                {t('communities.leave')}
              </Button>
            )}
          </Stack>
        </Flex>

        <Text color='gray.500' mb={4}>
          {t('communities.member_count', { count: community.membersCount })}
        </Text>
      </Box>
    </Box>
  )
}
