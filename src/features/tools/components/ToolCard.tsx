import { Avatar, Badge, Box, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiMapPin, FiStar } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { ServerImage } from '../../../components/shared'
import type { Tool } from '../../../types'
import { formatCurrency } from '../../../utils'

interface ToolCardProps {
  tool: Tool
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius='lg'
      overflow='hidden'
      transition='transform 0.2s'
      _hover={{ transform: 'translateY(-4px)' }}
    >
      <Box position='relative'>
        <ServerImage imageId={tool.images[0]?.hash} alt={tool.title} height='200px' width='100%' objectFit='cover' />
        <Badge
          position='absolute'
          top={2}
          right={2}
          colorScheme={tool.isAvailable ? 'green' : 'gray'}
          px={2}
          py={1}
          borderRadius='full'
        >
          {t(`tools.status.${tool.isAvailable ? 'available' : 'unavailable'}`)}
        </Badge>
      </Box>

      <Stack p={4} spacing={3}>
        <Stack spacing={1}>
          <Link
            as={RouterLink}
            to={`/tools/${tool.id}`}
            fontWeight='semibold'
            fontSize='lg'
            _hover={{ color: 'primary.500', textDecoration: 'none' }}
          >
            {tool.title}
          </Link>
          <Text color='primary.500' fontSize='xl' fontWeight='bold'>
            {formatCurrency(tool.cost)}/day
          </Text>
        </Stack>

        <Text color='gray.600' noOfLines={2} title={tool.description}>
          {tool.description}
        </Text>

        <Stack direction='row' align='center' color='gray.600' fontSize='sm'>
          <FiMapPin />
          {/*todo(konv1):*/}
          <Text noOfLines={1}>{'tool.location'}</Text>
        </Stack>

        <Stack direction='row' align='center' spacing={4}>
          <Stack direction='row' align='center' spacing={2}>
            <Avatar
              size='sm'
              name={tool.userId}
              // todo(konv1): add avatar
              // src={tool.owner.avatar}
            />
            <Link
              as={RouterLink}
              to={`/users/${tool.userId}`}
              fontWeight='medium'
              _hover={{ color: 'primary.500', textDecoration: 'none' }}
            >
              {/*todo(konv1):*/}
              {'tool.owner.name'}
            </Link>
          </Stack>
          <Stack direction='row' align='center' color='orange.400'>
            <FiStar />
            {/*todo(konv1):*/}
            <Text>{'tool.owner.rating.toFixed(1)'}</Text>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
