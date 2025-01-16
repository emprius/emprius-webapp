import { Box, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { useUserTools } from '~components/Tools/toolsQueries'
import { ToolCard } from './ToolCard'

export const UserTools = () => {
  const { t } = useTranslation()
  const { data: tools, isLoading } = useUserTools()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!tools?.tools?.length) {
    return (
      <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} textAlign='center'>
        <Text color='gray.600'>{t('user.noTools')}</Text>
      </Box>
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {tools.tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </SimpleGrid>
  )
}
