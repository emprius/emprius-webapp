import {
  Avatar,
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
import { FiBookmark, FiLogOut, FiMoon, FiSun, FiTool, FiUser } from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'
import { LanguageSwitcher } from '../shared/LanguageSwitcher'

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
          <Link as={RouterLink} to='/' _hover={{ textDecoration: 'none' }}>
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
                  <Avatar size='sm' name={user?.name} src={user?.avatarHash} cursor='pointer' />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                    {t('nav.profile')}
                  </MenuItem>
                  <MenuItem icon={<FiTool />} onClick={() => navigate('/tools/new')}>
                    {t('nav.addTool')}
                  </MenuItem>
                  <MenuItem icon={<FiBookmark />} onClick={() => navigate('/search')}>
                    {t('nav.findTools')}
                  </MenuItem>
                  <MenuItem icon={<FiLogOut />} onClick={logout}>
                    {t('nav.logout')}
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Stack direction='row' spacing={2}>
                <Button as={RouterLink} to='/login' variant='ghost'>
                  {t('nav.login')}
                </Button>
                <Button as={RouterLink} to='/register'>
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
