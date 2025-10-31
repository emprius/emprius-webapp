import { Box, Button, Flex, Link, Stack, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { ContextSearchBarForm } from '~components/Search/SearchBarForm'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { BadgeIcon } from '../Layout/BadgeIcon'

import logo from '/assets/logos/logo.png'
import DonateButton from '~components/Layout/DonateButton'
import { useUnreadMessageCounts } from '~components/Messages/queries'
import AvatarMenu from '~components/Navbar/AvatarMenu'
import { LanguageSwitcher } from '~components/Navbar/LanguageSwitcher'

export const Navbar = () => {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
  const { pendingRatingsCount, pendingRequestsCount, pendingInvitesCount } = usePendingActions()
  const { data: unreadCounts } = useUnreadMessageCounts()
  const location = useLocation()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const iconColor = useColorModeValue('primary.500', 'whiteAlpha.900')

  const donateButtonOnlyIcon = useBreakpointValue({ base: true, md: false })

  return (
    <Flex
      as='nav'
      position='sticky'
      top='auto'
      zIndex={1000}
      bg={bgColor}
      borderBottom={1}
      borderStyle='solid'
      borderColor={borderColor}
      shadow='sm'
      align={'center'}
      py={4}
      px={4}
    >
      <Stack direction='row' align='center' spacing={1} flex='1' mr={4}>
        <Link as={RouterLink} to={ROUTES.HOME} _hover={{ textDecoration: 'none' }}>
          <Box as='img' src={logo} alt='Emprius' h='40px' />
        </Link>

        {isAuthenticated && location.pathname !== ROUTES.HOME && (
          <Flex flex={1} align={'center'}>
            <ContextSearchBarForm />
          </Flex>
        )}
        <LanguageSwitcher iconOnly display={{ base: 'none', sm: 'inherit' }} />
        <DonateButton display={{ base: 'none', sm: 'inherit' }} onlyIcon={donateButtonOnlyIcon} />
      </Stack>

      <Stack direction='row' align='center' spacing={{ base: 2, md: 4 }}>
        {isAuthenticated && (
          <>
            <Stack direction='row' align='center' spacing={4} display={{ base: 'none', md: 'flex' }}>
              {pendingRequestsCount > 0 && (
                <Link
                  as={RouterLink}
                  to={ROUTES.BOOKINGS.REQUESTS}
                  display='flex'
                  alignItems='center'
                  p={2}
                  borderRadius='md'
                  _hover={{ bg: 'gray.100', _dark: { bg: 'primary.400' } }}
                >
                  <BadgeIcon
                    icon={icons.loan}
                    aria-label={t('nav.my_bookings')}
                    count={pendingRequestsCount}
                    color={iconColor}
                    iconProps={{ boxSize: 5 }}
                  />
                  <Text ml={2} display={{ base: 'none', xl: 'block' }} color={iconColor}>
                    {t('nav.my_bookings')}
                  </Text>
                </Link>
              )}
              {pendingRatingsCount > 0 && (
                <Link
                  as={RouterLink}
                  to={ROUTES.RATINGS.PENDING}
                  display='flex'
                  alignItems='center'
                  p={2}
                  borderRadius='md'
                  _hover={{ bg: 'gray.100', _dark: { bg: 'primary.400' } }}
                >
                  <BadgeIcon
                    icon={icons.ratings}
                    aria-label={t('nav.ratings')}
                    count={pendingRatingsCount}
                    color={iconColor}
                    iconProps={{ boxSize: 5 }}
                  />
                  <Text ml={2} display={{ base: 'none', xl: 'block' }} color={iconColor}>
                    {t('nav.ratings')}
                  </Text>
                </Link>
              )}
              {unreadCounts?.total && (
                <Link
                  as={RouterLink}
                  to={ROUTES.MESSAGES.CONVERSATIONS}
                  display='flex'
                  alignItems='center'
                  p={2}
                  borderRadius='md'
                  _hover={{ bg: 'gray.100', _dark: { bg: 'primary.400' } }}
                >
                  <BadgeIcon
                    icon={icons.messages}
                    aria-label={t('messages.title')}
                    count={unreadCounts?.total}
                    color={iconColor}
                    iconProps={{ boxSize: 5 }}
                  />
                  <Text ml={2} display={{ base: 'none', xl: 'block' }} color={iconColor}>
                    {t('messages.title')}
                  </Text>
                </Link>
              )}
              <Button as={RouterLink} to={ROUTES.TOOLS.NEW} leftIcon={icons.add({})}>
                <Text>{t('tools.add_tool')}</Text>
              </Button>
            </Stack>

            <AvatarMenu />
          </>
        )}
        {!isAuthenticated && (
          <Stack direction='row' spacing={2}>
            <Button as={RouterLink} to={ROUTES.AUTH.LOGIN} variant='ghost'>
              {t('nav.login')}
            </Button>
            <Button as={RouterLink} to={ROUTES.AUTH.REGISTER}>
              {t('nav.register')}
            </Button>
          </Stack>
        )}
      </Stack>
    </Flex>
  )
}
