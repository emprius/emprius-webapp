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
  const selectedBg = useColorModeValue('primary.50', 'primary.900')
  const selectedColor = useColorModeValue('primary.600', 'primary.200')
  const { pendingRatingsCount, pendingRequestsCount } = usePendingActions()

  const menuItems = useMemo(
    () => [
      { icon: icons.user, label: t('nav.profile'), path: ROUTES.PROFILE.VIEW },
      { icon: icons.tools, label: t('nav.my_tools'), path: ROUTES.TOOLS.LIST },
      { icon: icons.add, label: t('tools.add_tool'), path: ROUTES.TOOLS.NEW },
      { icon: icons.request, label: t('bookings.my_petitions'), path: ROUTES.BOOKINGS.PETITIONS },
      {
        icon: icons.loan,
        label: t('bookings.tool_requests'),
        path: ROUTES.BOOKINGS.REQUESTS,
        count: pendingRequestsCount,
      },
      { icon: icons.ratings, label: t('nav.ratings'), path: ROUTES.RATINGS, count: pendingRatingsCount },
      { icon: icons.users, label: t('user.list_title'), path: ROUTES.USERS.LIST },
    ],
    [t]
  )

  return (
    <Box
      // position='fixed'
      // left={0}
      // p={5}
      // top={0}
      w='300px'
      // h='100vh'
      bg={bgColor}
      px={4}
      pt={5}
      borderRight='1px'
      borderColor={borderColor}
      // zIndex={800} // Below navbar but above content
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
  const selectedColor = useColorModeValue('primary.600', 'primary.200')
  const menuItems = useMemo(
    () => [
      { icon: icons.user, path: ROUTES.PROFILE.VIEW },
      { icon: icons.tools, path: ROUTES.TOOLS.LIST },
      { icon: icons.add, path: ROUTES.TOOLS.NEW, central: true },
      {
        icon: icons.loan,
        path: ROUTES.BOOKINGS.REQUESTS,
        count: pendingRequestsCount,
        additionalPath: ROUTES.BOOKINGS.PETITIONS, // This menu item can be selected on two different paths
      },
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
      zIndex={999}
    >
      {menuItems.map((item, index) => {
        const isSelected =
          location.pathname === item.path || location.pathname === item?.additionalPath ? selectedColor : 'inherit'
        return (
          <Box key={index} as={RouterLink} to={item.path} p={3}>
            <BadgeIcon
              icon={item.icon}
              aria-label={t('nav.my_bookings')}
              count={item?.count}
              badgeProps={{ top: '-12px', right: '-12px' }}
              color={isSelected}
              fontSize='24px'
              iconProps={
                item?.central
                  ? {
                      boxSize: 9,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'full',
                      border: '3px solid',
                      borderColor: location.pathname === item.path ? selectedColor : 'black',
                    }
                  : {}
              }
            />
          </Box>
        )
      })}
    </Flex>
  )
}

export const DashboardLayout = () => {
  return (
    <Flex>
      <Show above='md'>
        <Flex gap={2} w={'full'} minH={'100vh'}>
          <SideNav />
          <Flex w={'full'}>
            <Outlet />
          </Flex>
        </Flex>
      </Show>
      <Hide above='md'>
        <Box mb='60px'>
          <Outlet />
        </Box>
        <BottomNav />
      </Hide>
    </Flex>
  )
}
