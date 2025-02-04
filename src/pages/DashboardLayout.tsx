import { Box, Flex, Hide, Icon, Show, useColorModeValue } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { usePendingActions } from '~components/InfoProviders/PendingActionsProvider'
import { BadgeCounter, BadgeIcon } from '~components/Layout/BadgeIcon'

import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'

const SideNav = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const location = useLocation()
  const selectedBg = useColorModeValue('blue.50', 'blue.900')
  const selectedColor = useColorModeValue('blue.600', 'blue.200')
  const { pendingRatingsCount, pendingRequestsCount } = usePendingActions()

  const menuItems = useMemo(
    () => [
      { icon: icons.user, label: t('nav.profile'), path: ROUTES.PROFILE.VIEW },
      { icon: icons.tools, label: t('nav.my_tools'), path: ROUTES.TOOLS.LIST },
      { icon: icons.add, label: t('tools.add_tool'), path: ROUTES.TOOLS.NEW },
      { icon: icons.bookings, label: t('nav.my_bookings'), path: ROUTES.BOOKINGS, count: pendingRequestsCount },
      { icon: icons.ratings, label: t('nav.ratings'), path: ROUTES.RATINGS, count: pendingRatingsCount },
      { icon: icons.users, label: t('user.list_title'), path: ROUTES.USERS.LIST },
    ],
    [t]
  )

  return (
    <Box
      position='fixed'
      left={0}
      p={5}
      w='250px'
      top={0}
      h='100vh'
      bg={bgColor}
      borderRight='1px'
      borderColor={borderColor}
      pt='80px' // Space for the main navbar
    >
      {menuItems.map((item) => (
        <Flex
          key={item.label}
          as={RouterLink}
          to={item.path}
          align='center'
          p={3}
          mx={-3}
          borderRadius='lg'
          role='group'
          cursor='pointer'
          bg={location.pathname === item.path ? selectedBg : 'transparent'}
          color={location.pathname === item.path ? selectedColor : 'inherit'}
          _hover={{
            bg: location.pathname === item.path ? selectedBg : useColorModeValue('gray.100', 'gray.700'),
          }}
          mb={2}
        >
          <Icon
            mr={4}
            fontSize='16'
            as={item.icon}
            color={location.pathname === item.path ? selectedColor : 'inherit'}
          />
          <BadgeCounter
            count={item?.count}
            badgeProps={{
              top: '-4px',
              right: '-20px',
            }}
          >
            {item.label}
          </BadgeCounter>
        </Flex>
      ))}
    </Box>
  )
}

const BottomNav = () => {
  const { pendingRatingsCount, pendingRequestsCount } = usePendingActions()
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const location = useLocation()
  const selectedColor = useColorModeValue('blue.600', 'blue.200')
  const menuItems = useMemo(
    () => [
      { icon: icons.user, path: ROUTES.PROFILE.VIEW },
      { icon: icons.tools, path: ROUTES.TOOLS.LIST },
      { icon: icons.add, path: ROUTES.TOOLS.NEW },
      { icon: icons.bookings, path: ROUTES.BOOKINGS, count: pendingRequestsCount },
      { icon: icons.ratings, path: ROUTES.RATINGS, count: pendingRatingsCount },
    ],
    [t]
  )

  return (
    <Flex
      position='fixed'
      bottom={0}
      left={0}
      right={0}
      h='60px'
      bg={bgColor}
      borderTop='1px'
      borderColor={borderColor}
      justify='space-around'
      align='center'
      px={4}
      zIndex={99}
    >
      {menuItems.map((item, index) => (
        <Box key={index} as={RouterLink} to={item.path} p={3}>
          <BadgeIcon
            icon={item.icon}
            aria-label={t('nav.my_bookings')}
            count={item?.count}
            badgeProps={{ top: '-12px', right: '-12px' }}
            color={location.pathname === item.path ? selectedColor : 'inherit'}
            fontSize='24px'
          />
        </Box>
      ))}
    </Flex>
  )
}

export const DashboardLayout = () => {
  return (
    <Box>
      <Show above='md'>
        <SideNav />
        <Box ml='250px'>
          <Outlet />
        </Box>
      </Show>
      <Hide above='md'>
        <Box mb='60px'>
          <Outlet />
        </Box>
        <BottomNav />
      </Hide>
    </Box>
  )
}
