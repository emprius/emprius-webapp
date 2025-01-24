import React from 'react'
import { Box, Button, Container, Heading, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'

export const NotFoundPage = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Box minH='100vh' display='flex' alignItems='center' bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW='container.md'>
        <VStack spacing={8} bg={bgColor} p={8} borderRadius='lg' boxShadow='sm' textAlign='center'>
          <Heading size='2xl'>404</Heading>
          <VStack spacing={4}>
            <Heading size='xl'>{t('error.page_not_found')}</Heading>
            <Text color='gray.600' fontSize='lg'>
              {t('error.page_not_found_desc')}
            </Text>
          </VStack>

          <Button as={RouterLink} to='/' size='lg' leftIcon={<FiArrowLeft />}>
            {t('common.back_to_home')}
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}
