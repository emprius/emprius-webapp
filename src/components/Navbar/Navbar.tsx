import {
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiSettings } from 'react-icons/fi'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar, avatarSizeToPixels } from '~components/Images/Avatar'
import { usePendingActions } from '~components/InfoProviders/PendingActionsProvider'
import { ContextSearchBar } from '~components/Search/SearchBar'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { BadgeIcon } from '../Layout/BadgeIcon'
import { useIsDashboardLayout } from '~src/pages/DashboardLayout'

export const Navbar = () => {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
  const { pendingRatingsCount, pendingRequestsCount } = usePendingActions()
  const location = useLocation()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const iconColor = useColorModeValue('primary.500', 'whiteAlpha.900')

  const isDashboardLayout = useIsDashboardLayout()

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
          <Box as='img' src='/assets/logos/logo.png' alt='Emprius' h='40px' />
        </Link>

        {isAuthenticated && location.pathname !== ROUTES.HOME && (
          <Flex flex={1} align={'center'}>
            <ContextSearchBar />
          </Flex>
        )}
        <Button
          as={RouterLink}
          to={'https://emprius.cat/collabora/'}
          leftIcon={icons.donate({})}
          variant={'cta'}
          sx={{
            '& .chakra-button__icon': {
              marginEnd: { base: '0', md: '0.5rem' },
            },
          }}
        >
          <Text display={{ base: 'none', md: 'block' }}>{t('donate', { defaultValue: 'Donate' })}</Text>
        </Button>
      </Stack>

      <Stack direction='row' align='center' spacing={{ base: 2, md: 4 }}>
        {isAuthenticated && (
          <>
            <Stack direction='row' align='center' spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link
                as={RouterLink}
                to={ROUTES.BOOKINGS.REQUESTS}
                display='flex'
                alignItems='center'
                p={2}
                borderRadius='md'
                _hover={{ bg: 'gray.100' }}
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
              <Link
                as={RouterLink}
                to={ROUTES.RATINGS.PENDING}
                display='flex'
                alignItems='center'
                p={2}
                borderRadius='md'
                _hover={{ bg: 'gray.100' }}
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
              <Button as={RouterLink} to={ROUTES.TOOLS.NEW} leftIcon={icons.add({})}>
                <Text>{t('tools.add_tool')}</Text>
              </Button>
            </Stack>

            {/*Little screens menu*/}
            <Box display={{ base: 'block', md: 'none' }}>
              <Menu>
                <MenuButton>
                  <Icon boxSize={6} as={icons.menu} mt={1} />
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to={ROUTES.PROFILE.EDIT} icon={<FiSettings />}>
                    {t('nav.settings')}
                  </MenuItem>
                  <MenuItem as={RouterLink} to={ROUTES.USERS.LIST} icon={icons.users({})}>
                    {t('user.list_title')}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>

            {/*Big screens menu*/}
            <Link
              as={RouterLink}
              to={isDashboardLayout ? ROUTES.SEARCH : ROUTES.PROFILE.VIEW}
              minW={avatarSizeToPixels['sm']}
            >
              <Avatar size='sm' username={user?.name} avatarHash={user?.avatarHash} />
            </Link>
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
