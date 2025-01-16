import { Box, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { OwnerToolButtons } from '~components/Tools/shared/OwnerToolButtons'
import { Tool } from '~components/Tools/types'
import { ROUTES } from '~src/router/router'
import { ToolImage, ToolPriceRating } from './shared'

interface ToolCardProps {
  tool: Tool
}

export const ToolCard = ({ tool }: ToolCardProps) => {
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
      _hover={{ transform: 'translateY(-4px)', cursor: 'pointer' }}
    >
      <Link
        as={RouterLink}
        to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}
        fontWeight='semibold'
        fontSize='lg'
        _hover={{ color: 'primary.500', textDecoration: 'none' }}
      >
        <Box position='relative'>
          <ToolImage imageHash={tool.images[0]?.hash} title={tool.title} isAvailable={tool.isAvailable} />
        </Box>

        <Stack p={4} spacing={3}>
          <Stack spacing={1}>
            <Link
              as={RouterLink}
              to={ROUTES.TOOLS.DETAIL.replace(':id', tool.id.toString())}
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
        </Stack>
      </Link>
      <OwnerToolButtons tool={tool} />
    </Box>
  )
}
