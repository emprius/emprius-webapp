import React from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useCommunityInvites, useAcceptInvite, useRefuseInvite } from './queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { ServerImage } from '~components/Images/ServerImage'
import { icons } from '~theme/icons'
import { formatDistanceToNow } from 'date-fns'

export const CommunityInvites: React.FC = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const { data, isLoading, isError } = useCommunityInvites()
  const { mutateAsync: acceptInvite, isPending: isAccepting } = useAcceptInvite()
  const { mutateAsync: refuseInvite, isPending: isRefusing } = useRefuseInvite()
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  
  const handleAccept = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId)
      toast({
        title: t('communities.invite_accepted'),
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.something_went_wrong'),
        status: 'error',
        duration: 3000,
      })
    }
  }
  
  const handleRefuse = async (inviteId: string) => {
    try {
      await refuseInvite(inviteId)
      toast({
        title: t('communities.invite_refused'),
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.something_went_wrong'),
        status: 'error',
        duration: 3000,
      })
    }
  }
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (isError) {
    return (
      <ElementNotFound
        icon={icons.users}
        title={t('common.error')}
        desc={t('common.something_went_wrong')}
      />
    )
  }
  
  if (!data?.invites || data.invites.length === 0) {
    return (
      <Box p={6} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <ElementNotFound
          icon={icons.users}
          title={t('communities.no_invites')}
          desc={t('communities.no_invites_desc')}
        />
      </Box>
    )
  }
  
  return (
    <Stack spacing={6}>
      <Heading size="lg">{t('communities.pending_invites')}</Heading>
      
      <Stack spacing={4}>
        {data.invites.map(invite => (
          <Box
            key={invite.id}
            p={4}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Flex justify="space-between" align="center" flexWrap={{ base: 'wrap', md: 'nowrap' }} gap={4}>
              <Flex gap={4} flex="1" align="center">
                <Box width="60px" height="60px" borderRadius="md" overflow="hidden" flexShrink={0}>
                  <ServerImage 
                    imageId={invite.imageHash} 
                    alt={invite.communityName}
                    fallbackSrc="/assets/logos/tool-fallback.svg"
                  />
                </Box>
                <Box>
                  <Heading size="md" mb={1}>{invite.communityName}</Heading>
                  <Text fontSize="sm" color="gray.500">
                    {t('communities.invited_by', { name: invite.invitedBy })}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {t('communities.invited_time', { 
                      time: formatDistanceToNow(new Date(invite.createdAt), { addSuffix: true }) 
                    })}
                  </Text>
                </Box>
              </Flex>
              
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={2}>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleRefuse(invite.id)}
                  isLoading={isRefusing}
                >
                  {t('communities.refuse')}
                </Button>
                <Button
                  colorScheme="primary"
                  onClick={() => handleAccept(invite.id)}
                  isLoading={isAccepting}
                >
                  {t('communities.accept')}
                </Button>
              </Stack>
            </Flex>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
