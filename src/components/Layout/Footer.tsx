import { Box, Container, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiGithub } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/router'

export const Footer = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box as='footer' bg={bgColor} borderTop={1} borderStyle='solid' borderColor={borderColor} py={8} mt='auto'>
      <Container maxW='container.xl'>
        <Stack direction={{ base: 'column', md: 'row' }} justify='space-between' align='center' spacing={4}>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={{ base: 2, sm: 6 }} align='center'>
            <Link as={RouterLink} to={ROUTES.HOME} color={textColor} _hover={{ color: 'primary.500' }}>
              {t('nav.home')}
            </Link>
            <Link as={RouterLink} to={ROUTES.ABOUT} color={textColor} _hover={{ color: 'primary.500' }}>
              {t('nav.about')}
            </Link>
          </Stack>

          <Stack direction='row' spacing={6} align='center' color={textColor} fontSize='sm'>
            <Text>© {new Date().getFullYear()} Emprius</Text>
            <Link
              href='https://github.com/emprius'
              target='_blank'
              rel='noopener noreferrer'
              display='inline-flex'
              alignItems='center'
              _hover={{ color: 'primary.500' }}
            >
              <FiGithub size={20} />
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
