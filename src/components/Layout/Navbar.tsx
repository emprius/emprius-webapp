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
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FiBookmark, FiLogOut, FiMoon, FiSearch, FiSettings, FiStar, FiSun, FiTool, FiUser } from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar } from '~components/Images/Avatar'
import { ROUTES } from '~src/router/router'
import { LanguageSwitcher } from './LanguageSwitcher'

export const Navbar = () => {
  const { t } = useTranslation()
  const { colorMode, toggleColorMode } = useColorMode()
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

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
                <IconButton
                  aria-label={t('nav.my_tools')}
                  icon={<FiTool />}
                  onClick={() => navigate(ROUTES.TOOLS.LIST)}
                  variant='ghost'
                />
                <IconButton
                  aria-label={t('nav.my_bookings')}
                  icon={<FiBookmark />}
                  onClick={() => navigate(ROUTES.BOOKINGS)}
                  variant='ghost'
                />
                <IconButton
                  aria-label={t('nav.ratings')}
                  icon={<FiStar />}
                  onClick={() => navigate(ROUTES.RATINGS)}
                  variant='ghost'
                />
                <IconButton
                  aria-label={t('nav.find_tools')}
                  icon={<FiSearch />}
                  onClick={() => navigate(ROUTES.SEARCH)}
                  variant='ghost'
                />
              </Stack>
            )}
          </Stack>

          <Stack direction='row' align='center' spacing={{ base: 2, md: 4 }}>
            <IconButton
              aria-label={t('common.toggleTheme')}
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
                    <MenuItem icon={<FiUser />} onClick={() => navigate(ROUTES.PROFILE.VIEW)}>
                      {t('nav.profile')}
                    </MenuItem>
                    <MenuItem icon={<FiSettings />} onClick={() => navigate(ROUTES.PROFILE.EDIT)}>
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
                      <MenuItem icon={<FiUser />} onClick={() => navigate(ROUTES.PROFILE.VIEW)}>
                        {t('nav.profile')}
                      </MenuItem>
                      <MenuItem icon={<FiTool />} onClick={() => navigate(ROUTES.TOOLS.LIST)}>
                        {t('nav.my_tools')}
                      </MenuItem>
                      <MenuItem icon={<FiBookmark />} onClick={() => navigate(ROUTES.BOOKINGS)}>
                        {t('nav.my_bookings')}
                      </MenuItem>
                      <MenuItem icon={<FiStar />} onClick={() => navigate(ROUTES.RATINGS)}>
                        {t('nav.ratings')}
                      </MenuItem>
                      <MenuItem icon={<FiSearch />} onClick={() => navigate(ROUTES.SEARCH)}>
                        {t('nav.find_tools')}
                      </MenuItem>
                      <MenuItem icon={<FiSettings />} onClick={() => navigate(ROUTES.PROFILE.EDIT)}>
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
