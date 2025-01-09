import { Box, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '~src/features/auth/context/AuthContext'
import { useUserTools } from '~src/features/user/userQueries'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { ToolCard } from '../../../features/tools/components/ToolCard'

export const UserTools = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: tools, isLoading } = useUserTools()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!tools?.length) {
    return (
      <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} textAlign='center'>
        <Text color='gray.600'>{t('user.noTools')}</Text>
      </Box>
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </SimpleGrid>
  )
}
