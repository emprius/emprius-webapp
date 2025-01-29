import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '~src/router/routes'

export const ServerErrorPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleRetry = () => {
    // Reload the page to retry the connection
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate(ROUTES.HOME)
  }

  return (
    <Container maxW='container.md' py={20}>
      <VStack spacing={8} textAlign='center'>
        <Heading size='2xl'>🔌</Heading>
        <Heading>{t('error.server_error')}</Heading>
        <Text color='gray.600'>{t('error.cannot_reach_server')}</Text>
        <Box>
          <Button onClick={handleRetry} colorScheme='primary' mr={4}>
            {t('error.retry')}
          </Button>
          <Button onClick={handleGoHome} variant='ghost'>
            {t('error.go_home')}
          </Button>
        </Box>
      </VStack>
    </Container>
  )
}
