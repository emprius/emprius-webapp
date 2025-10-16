import React from 'react'
import { Box, Flex, FlexProps, Heading, HStack, Icon, Skeleton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Community } from './types'
import { ROUTES } from '~src/router/routes'
import { ServerImage } from '~components/Images/ServerImage'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar, AvatarSize } from '~components/Images/Avatar'
import { useCommunityDetail } from '~components/Communities/queries'
import { icons } from '~theme/icons'
import { useTranslation } from 'react-i18next'

type CommunityCardProps = {
  community: Community
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { user } = useAuth()

  return (
    <Box
      as={RouterLink}
      to={`${ROUTES.COMMUNITIES.DETAIL.replace(':id', community.id)}`}
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      borderColor={borderColor}
      bg={bgColor}
      transition='all 0.2s'
      _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
    >
      <Box position='relative' height='140px' overflow='hidden'>
        <ServerImage
          imageId={community.image}
          alt={community.name}
          fallbackSrc='/assets/logos/tool-fallback.svg'
          objectFit='cover'
          width='100%'
          height='100%'
        />
      </Box>

      <Box p={4}>
        <Heading size='md' mb={2} noOfLines={1}>
          <HStack>
            <Icon as={icons.communities} />
            <Box>{community.name}</Box>
          </HStack>
        </Heading>

        <Flex justify='space-between' align='center' mt={2}>
          <Text fontSize='sm' color='gray.500'>
            {community?.membersCount} members
          </Text>

          <Text fontSize='sm' fontWeight='bold' color='primary.500'>
            {community?.ownerId === user.id ? 'Owner' : 'Member'}
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}

type CommunityCardLittleProps = {
  id: string
  avatarSize?: AvatarSize
} & FlexProps

export const CommunityCardLittle: React.FC<CommunityCardLittleProps> = ({ id, avatarSize = 'md', ...flexProps }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const { t } = useTranslation()
  const { data, isLoading } = useCommunityDetail(id)

  if (isLoading) {
    return (
      <HStack spacing={4}>
        <Skeleton height='32px' width='32px' borderRadius='full' />
        <Stack spacing={2}>
          <Skeleton height='16px' width='120px' />
          <Skeleton height='14px' width='80px' />
        </Stack>
      </HStack>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Flex
      flex={1}
      align='center'
      gap={4}
      p={4}
      bg={bgColor}
      as={RouterLink}
      to={`${ROUTES.COMMUNITIES.DETAIL.replace(':id', data.id)}`}
      {...flexProps}
    >
      <Avatar username={data.name} avatarHash={data.image} size={avatarSize} isSquare />
      <Stack direction={'column'} spacing={1}>
        <HStack spacing={1}>
          <Icon as={icons.communities} />
          <Text fontWeight='bold' wordBreak='break-word'>
            {data.name}
          </Text>
        </HStack>
        <Text fontSize='sm' color='gray.500'>
          {t('communities.member_count', { defaultValue: '{{ count }} members', count: data?.membersCount })}
        </Text>
      </Stack>
    </Flex>
  )
}
