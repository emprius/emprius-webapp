import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Container, SimpleGrid, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '~src/router/router'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ToolCard } from '~components/Tools/ToolCard'
import { useTools } from '~components/Tools/toolsQueries'

export const ToolsListPage = () => {
  const { t } = useTranslation()
  const { data: toolsResponse, isLoading } = useTools()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')

  if (isLoading) {
    return <LoadingSpinner />
  }

  const tools = toolsResponse?.tools || []

  return (
    <Container maxW='container.xl' py={8}>
      <Box flex={1}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </SimpleGrid>
      </Box>

      <Button
        position='fixed'
        bottom='2rem'
        left='50%'
        transform='translateX(-50%)'
        colorScheme='blue'
        size='lg'
        borderRadius='full'
        px={6}
        onClick={() => navigate(ROUTES.TOOLS.NEW)}
        boxShadow='lg'
        leftIcon={<AddIcon />}
      >
        {t('add tool')}
      </Button>
    </Container>
  )
}
