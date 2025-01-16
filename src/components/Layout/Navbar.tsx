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
import { FiBookmark, FiLogOut, FiMoon, FiStar, FiSun, FiTool, FiUser } from 'react-icons/fi'
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
          <Link as={RouterLink} to={ROUTES.HOME} _hover={{ textDecoration: 'none' }}>
            <Box as='img' src='/assets/logos/logo.png' alt='Emprius' h='40px' />
          </Link>

          <Stack direction='row' align='center' spacing={{ base: 2, md: 4 }}>
            <IconButton
              aria-label={t('common.toggleTheme')}
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant='ghost'
            />

            <LanguageSwitcher />

            {isAuthenticated ? (
              <Menu>
                <MenuButton>
                  <Avatar size='sm' username={user?.name} avatarHash={user?.avatarHash} />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FiUser />} onClick={() => navigate(ROUTES.PROFILE)}>
                    {t('nav.profile')}
                  </MenuItem>
                  <MenuItem icon={<FiTool />} onClick={() => navigate(ROUTES.TOOLS.LIST)}>
                    {t('nav.myTools')}
                  </MenuItem>
                  <MenuItem icon={<FiBookmark />} onClick={() => navigate(ROUTES.BOOKINGS)}>
                    {t('nav.myBookings')}
                  </MenuItem>
                  <MenuItem icon={<FiStar />} onClick={() => navigate(ROUTES.RATINGS)}>
                    {t('nav.ratings')}
                  </MenuItem>
                  <MenuItem icon={<FiBookmark />} onClick={() => navigate(ROUTES.SEARCH)}>
                    {t('nav.findTools')}
                  </MenuItem>
                  <MenuItem icon={<FiLogOut />} onClick={logout}>
                    {t('nav.logout')}
                  </MenuItem>
                </MenuList>
              </Menu>
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
