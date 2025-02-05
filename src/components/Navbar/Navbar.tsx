import {
  Box,
  Button,
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
import { FiLogOut, FiSettings } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar, avatarSizeToPixels } from '~components/Images/Avatar'
import { usePendingActions } from '~components/InfoProviders/PendingActionsProvider'
import { SearchBar } from '~components/Search/SearchBar'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { BadgeIcon } from '../Layout/BadgeIcon'

export const Navbar = () => {
  const { t } = useTranslation()
  const { isAuthenticated, logout, user } = useAuth()
  const { pendingRatingsCount, pendingRequestsCount } = usePendingActions()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const iconColor = useColorModeValue('primary.500', 'whiteAlpha.900')

  return (
    <Box
      as='nav'
      position='sticky'
      top={0}
      zIndex={1000}
      bg={bgColor}
      borderBottom={1}
      borderStyle='solid'
      borderColor={borderColor}
      shadow='sm'
    >
      <Stack direction='row' justify='space-between' align='center' spacing={4} py={4} px={4}>
        <Stack direction='row' align='center' spacing={4}>
          <Link as={RouterLink} to={ROUTES.HOME} _hover={{ textDecoration: 'none' }}>
            <Box as='img' src='/assets/logos/logo.png' alt='Emprius' h='40px' />
          </Link>

          {isAuthenticated && (
            <Box flex={1}>
              <SearchBar />
            </Box>
          )}
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
                  to={ROUTES.RATINGS}
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
                <Button as={RouterLink} to={ROUTES.TOOLS.NEW} borderRadius='lg' leftIcon={icons.add({})}>
                  <Text>{t('tools.add_tool')}</Text>
                </Button>
              </Stack>

              {/*Little screens menu*/}
              <Box display={{ base: 'block', md: 'none' }}>
                <Menu>
                  <MenuButton>
                    <Icon as={icons.menu} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to={ROUTES.PROFILE.EDIT} icon={<FiSettings />}>
                      {t('nav.settings')}
                    </MenuItem>
                    <MenuItem as={RouterLink} to={ROUTES.USERS.LIST} icon={icons.users({})}>
                      {t('user.list_title')}
                    </MenuItem>
                    <MenuItem icon={<FiLogOut />} onClick={logout}>
                      {t('nav.logout')}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>

              {/*Big screens menu*/}
              <Link as={RouterLink} to={ROUTES.PROFILE.VIEW} minW={avatarSizeToPixels['sm']}>
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
      </Stack>
    </Box>
  )
}
