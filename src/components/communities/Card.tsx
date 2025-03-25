import React from 'react'
import { Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Community } from './types'
import { ROUTES } from '~src/router/routes'
import { ServerImage } from '~components/Images/ServerImage'

interface CommunityCardProps {
  community: Community
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  
  return (
    <Box
      as={RouterLink}
      to={`${ROUTES.COMMUNITIES.DETAIL.replace(':id', community.id)}`}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={borderColor}
      bg={bgColor}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
    >
      <Box position="relative" height="140px" overflow="hidden">
        <ServerImage 
          imageId={community.imageHash} 
          alt={community.name} 
          fallbackSrc="/assets/logos/tool-fallback.svg"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>
      
      <Box p={4}>
        <Heading size="md" mb={2} noOfLines={1}>
          {community.name}
        </Heading>
        
        <Flex justify="space-between" align="center" mt={2}>
          <Text fontSize="sm" color="gray.500">
            {community.members.length} members
          </Text>
          
          <Text fontSize="sm" fontWeight="bold" color="primary.500">
            {community.members.find(m => m.id === 'currentUserId')?.role === 'owner' ? 'Owner' : 'Member'}
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}
