import { Box, Flex, Icon, Show, useColorModeValue } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { usePendingActions } from '~components/InfoProviders/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'

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
      { icon: icons.ratings, label: t('nav.ratings'), path: ROUTES.RATINGS.PENDING, count: pendingRatingsCount },
      { icon: icons.users, label: t('user.list_title'), path: ROUTES.USERS.LIST },
    ],
    [t]
  )

  return (
    <Flex direction={'column'} w='250px' bg={bgColor} px={2} pt={5} borderRight='1px' borderColor={borderColor}>
      {menuItems.map((item) => (
        <Flex
          key={item.label}
          as={RouterLink}
          to={item.path}
          align='center'
          p={2}
          mx={0}
          borderRadius='lg'
          role='group'
          cursor='pointer'
          bg={location.pathname === item.path ? selectedBg : 'transparent'}
          color={location.pathname === item.path ? selectedColor : 'inherit'}
          _hover={{
            bg: location.pathname === item.path ? selectedBg : useColorModeValue('gray.100', 'gray.700'),
          }}
          mb={2}
          fontSize={18}
        >
          <Icon mr={4} as={item.icon} color={location.pathname === item.path ? selectedColor : 'inherit'} />
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
    </Flex>
  )
}

export const DashboardLayout = () => {
  return (
    <Flex>
      <Flex w={'full'} minH={'100vh'}>
        <Show above='md'>
          <SideNav />
        </Show>
        <Box w={'100vw'}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}
