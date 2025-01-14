import { Avatar, Box, IconButton, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiEdit2, FiMapPin } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~src/features/auth/context/AuthContext'
import type { Tool } from '../../../types'
import { ToolImage, ToolPriceRating } from './shared'

interface ToolCardProps {
  tool: Tool
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const isOwner = user?.email === tool.userId

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
        <ToolImage imageHash={tool.images[0]?.hash} title={tool.title} isAvailable={tool.isAvailable} />
        {isOwner && (
          <Box position='absolute' top={2} right={2}>
            <IconButton
              as={RouterLink}
              to={`/tools/${tool.id}/edit`}
              icon={<FiEdit2 />}
              aria-label={t('tools.edit')}
              size='sm'
              colorScheme='blue'
              bg='white'
              _hover={{
                transform: 'scale(1.1)',
                bg: 'blue.50',
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          </Box>
        )}
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
          <ToolPriceRating cost={tool.cost} rating={tool.rating} />
        </Stack>

        <Text color='gray.600' noOfLines={2} title={tool.description}>
          {tool.description}
        </Text>

        <Stack direction='row' align='center' color='gray.600' fontSize='sm'>
          <FiMapPin />
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
        </Stack>
      </Stack>
    </Box>
  )
}
