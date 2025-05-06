import { Box, Flex, Icon, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
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
  const { pendingRatingsCount, pendingRequestsCount, pendingInvitesCount } = usePendingActions()

  const menuItems = useMemo(
    () => [
      { icon: icons.search, label: t('pages.search'), path: ROUTES.SEARCH },
      { icon: icons.user, label: t('nav.profile'), path: ROUTES.PROFILE.VIEW },
      { icon: icons.add, label: t('tools.add_tool'), path: ROUTES.TOOLS.NEW },
      { icon: icons.tools, label: t('nav.my_tools'), path: ROUTES.TOOLS.LIST },
      { icon: icons.request, label: t('bookings.my_petitions'), path: ROUTES.BOOKINGS.PETITIONS },
      {
        icon: icons.loan,
        label: t('bookings.tool_requests'),
        path: ROUTES.BOOKINGS.REQUESTS,
        count: pendingRequestsCount,
      },
      {
        icon: icons.ratings,
        label: t('nav.ratings'),
        path: pendingRatingsCount > 0 ? ROUTES.RATINGS.PENDING : ROUTES.RATINGS.HISTORY,
        count: pendingRatingsCount,
        additionalPath: [ROUTES.RATINGS.PENDING, ROUTES.RATINGS.HISTORY],
      },
      { icon: icons.users, label: t('user.list_title'), path: ROUTES.USERS.LIST },
      {
        icon: icons.communities,
        label: t('communities.title'),
        // Show invites tab if there are pending invites
        path: pendingInvitesCount > 0 ? ROUTES.COMMUNITIES.INVITES : ROUTES.COMMUNITIES.LIST,
        count: pendingInvitesCount,
      },
    ],
    [t, pendingRatingsCount, pendingRequestsCount, pendingInvitesCount]
  )

  return (
    <Flex
      direction={'column'}
      w='250px'
      bg={bgColor}
      px={2}
      pt={5}
      borderRight='1px'
      borderColor={borderColor}
      zIndex={4}
    >
      {menuItems.map((item) => {
        const isSelected =
          location.pathname === item.path || item?.additionalPath?.some((path) => path === location.pathname)
        return (
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
            bg={isSelected ? selectedBg : 'transparent'}
            color={isSelected ? selectedColor : 'inherit'}
            _hover={{
              bg: isSelected ? selectedBg : useColorModeValue('gray.100', 'gray.700'),
            }}
            mb={2}
            fontSize={18}
          >
            <Icon mr={4} as={item.icon} color={isSelected ? selectedColor : 'inherit'} />
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
        )
      })}
    </Flex>
  )
}

export const DashboardLayout = () => {
  const isDashboardLayout = useIsDashboardLayout()
  return (
    <Flex>
      <Flex w={'full'} minH={'100vh'}>
        {isDashboardLayout && <SideNav />}
        <Box w={'100vw'}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}

export const useIsDashboardLayout = () => useBreakpointValue({ base: false, md: true })
