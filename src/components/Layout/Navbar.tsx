import {
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiLogOut, FiMoon, FiSearch, FiSettings, FiSun } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar } from '~components/Images/Avatar'
import { LanguageSwitcher } from './LanguageSwitcher'
import { BadgeIcon } from './BadgeIcon'
import { usePendingActions } from '~components/Providers/PendingActionsProvider'
import { ROUTES } from '~src/router/routes'
import { icons } from '~utils/icons'

export const Navbar = () => {
  const { t } = useTranslation()
  const { colorMode, toggleColorMode } = useColorMode()
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
      <Container maxW='container.xl' py={4}>
        <Stack direction='row' justify='space-between' align='center' spacing={8}>
          <Stack direction='row' align='center' spacing={4}>
            <Link as={RouterLink} to={ROUTES.HOME} _hover={{ textDecoration: 'none' }}>
              <Box as='img' src='/assets/logos/logo.png' alt='Emprius' h='40px' />
            </Link>

            {isAuthenticated && (
              <Stack direction='row' align='center' spacing={4} display={{ base: 'none', md: 'flex' }}>
                <Link
                  as={RouterLink}
                  to={ROUTES.TOOLS.LIST}
                  display='flex'
                  alignItems='center'
                  p={2}
                  borderRadius='md'
                  _hover={{ bg: 'gray.100' }}
                >
                  <Box as={icons.tools} aria-label={t('nav.my_tools')} color={iconColor} boxSize={5} />
                  <Text ml={2} display={{ base: 'none', xl: 'block' }} color={iconColor}>
                    {t('nav.my_tools')}
                  </Text>
                </Link>
                <Link
                  as={RouterLink}
                  to={ROUTES.BOOKINGS}
                  display='flex'
                  alignItems='center'
                  p={2}
                  borderRadius='md'
                  _hover={{ bg: 'gray.100' }}
                >
                  <BadgeIcon
                    icon={icons.bookings}
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
                <Link
                  as={RouterLink}
                  to={ROUTES.SEARCH}
                  display='flex'
                  alignItems='center'
                  p={2}
                  borderRadius='md'
                  _hover={{ bg: 'gray.100' }}
                >
                  <Box as={FiSearch} aria-label={t('nav.find_tools')} color={iconColor} boxSize={5} />
                  <Text ml={2} display={{ base: 'none', xl: 'block' }} color={iconColor}>
                    {t('nav.find_tools')}
                  </Text>
                </Link>
                <Link
                  as={RouterLink}
                  to={ROUTES.USERS.LIST}
                  display='flex'
                  alignItems='center'
                  p={2}
                  borderRadius='md'
                  _hover={{ bg: 'gray.100' }}
                >
                  <Box as={icons.users} aria-label={t('user.list_title')} color={iconColor} boxSize={5} />
                  <Text ml={2} display={{ base: 'none', xl: 'block' }} color={iconColor}>
                    {t('user.list_title')}
                  </Text>
                </Link>
              </Stack>
            )}
          </Stack>

          <Stack direction='row' align='center' spacing={{ base: 2, md: 4 }}>
            <IconButton
              aria-label={t('common.toggle_theme')}
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant='ghost'
            />

            <LanguageSwitcher />

            {isAuthenticated ? (
              <>
                <Menu>
                  <MenuButton display={{ base: 'none', md: 'block' }}>
                    <Avatar size='sm' username={user?.name} avatarHash={user?.avatarHash} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to={ROUTES.PROFILE.VIEW} icon={icons.user({})}>
                      {t('nav.profile')}
                    </MenuItem>
                    <MenuItem as={RouterLink} to={ROUTES.PROFILE.EDIT} icon={<FiSettings />}>
                      {t('nav.settings')}
                    </MenuItem>
                    <MenuItem icon={<FiLogOut />} onClick={logout}>
                      {t('nav.logout')}
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Box display={{ base: 'block', md: 'none' }}>
                  <Menu>
                    <MenuButton>
                      <Avatar size='sm' username={user?.name} avatarHash={user?.avatarHash} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem as={RouterLink} to={ROUTES.PROFILE.VIEW} icon={icons.user({})}>
                        {t('nav.profile')}
                      </MenuItem>
                      <MenuItem as={RouterLink} to={ROUTES.TOOLS.LIST} icon={icons.tools({})}>
                        {t('nav.my_tools')}
                      </MenuItem>
                      <MenuItem
                        as={RouterLink}
                        to={ROUTES.BOOKINGS}
                        icon={
                          <BadgeIcon
                            icon={icons.bookings}
                            aria-label={t('nav.my_bookings')}
                            count={pendingRequestsCount}
                            badgeProps={{ top: '-12px', right: '-12px' }}
                          />
                        }
                      >
                        {t('nav.my_bookings')}
                      </MenuItem>
                      <MenuItem
                        as={RouterLink}
                        to={ROUTES.RATINGS}
                        icon={
                          <BadgeIcon
                            icon={icons.ratings}
                            aria-label={t('nav.ratings')}
                            count={pendingRatingsCount}
                            badgeProps={{ top: '-12px', right: '-12px' }}
                          />
                        }
                      >
                        {t('nav.ratings')}
                      </MenuItem>
                      <MenuItem as={RouterLink} to={ROUTES.SEARCH} icon={<FiSearch />}>
                        {t('nav.find_tools')}
                      </MenuItem>
                      <MenuItem as={RouterLink} to={ROUTES.USERS.LIST} icon={icons.users({})}>
                        {t('user.list_title')}
                      </MenuItem>
                      <MenuItem as={RouterLink} to={ROUTES.PROFILE.EDIT} icon={<FiSettings />}>
                        {t('nav.settings')}
                      </MenuItem>
                      <MenuItem icon={<FiLogOut />} onClick={logout}>
                        {t('nav.logout')}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              </>
            ) : (
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
      </Container>
    </Box>
  )
}
