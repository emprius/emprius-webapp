import { Box, Container, IconButton, Link, Stack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { FiGithub, FiMoon, FiSun } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { LanguageSwitcher } from '~components/Navbar/LanguageSwitcher'

import { ROUTES } from '~src/router/routes'
import { LogoutBtn } from '~components/Layout/LogoutBtn'
import { useTranslation } from 'react-i18next'
import DonateButton from '~components/Layout/DonateButton'
import { BOTTOM_NAV_HEIGHT } from '~components/Layout/BottomNav'
import { useIsDashboardLayout } from '~components/Layout/Contexts/DashboardLayoutContext'
import ColorModeSwitcher from '~components/Navbar/ColorModeSwitcher'

export const Footer = () => {
  const { t } = useTranslation()
  const { isDashboardBigLayout } = useIsDashboardLayout()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const commit = import.meta.env.COMMIT

  // Add additional margin to show the footer above the
  let additionalMargin = '0'
  if (!isDashboardBigLayout) {
    additionalMargin = BOTTOM_NAV_HEIGHT
  }

  return (
    <Box
      as='footer'
      bg={bgColor}
      borderTop={1}
      borderStyle='solid'
      borderColor={borderColor}
      py={8}
      mt='auto'
      position='relative'
      mb={additionalMargin}
      zIndex={2}
    >
      <Container maxW='container.xl'>
        <Stack spacing={6} align='center'>
          {/* First line: Theme and Language switchers */}
          <Stack direction='row' spacing={4} align='center'>
            <ColorModeSwitcher />
            <LanguageSwitcher />
            <LogoutBtn />
          </Stack>

          {/* Second line: Links, copyright and github */}
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={6} align='center'>
            <DonateButton display={{ base: 'inherit', sm: 'none' }} />
            <Stack direction='row' spacing={6} align='center'>
              <Link as={RouterLink} to={ROUTES.HOME} color={textColor} _hover={{ color: 'primary.500' }}>
                {t('nav.home')}
              </Link>
              <Link as={RouterLink} to={ROUTES.ABOUT} color={textColor} _hover={{ color: 'primary.500' }}>
                {t('nav.about')}
              </Link>
            </Stack>

            <Stack direction={{ base: 'column', sm: 'row' }} align={'center'}>
              <Text color={textColor}>© {new Date().getFullYear()} Emprius</Text>
              <Text fontSize='sm' color={textColor} my={0}>
                {commit}
              </Text>
            </Stack>
            <Link
              href='https://github.com/emprius'
              target='_blank'
              rel='noopener noreferrer'
              display='inline-flex'
              alignItems='center'
              color={textColor}
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
