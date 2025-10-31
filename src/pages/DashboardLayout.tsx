import { Box, Flex, Icon, IconButton, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, Outlet, useLocation, matchPath } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { BadgeCounter, BadgeIcon } from '~components/Layout/BadgeIcon'

import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { IconType } from 'react-icons'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { useUnreadMessageCounts } from '~components/Messages/queries'

const SideNav = () => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { pendingRatingsCount, pendingRequestsCount, pendingInvitesCount } = usePendingActions()
  const { data: unreadCounts } = useUnreadMessageCounts()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems: SidenavMenuItemProps[] = useMemo(
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
      {
        icon: icons.messages,
        label: t('messages.title', { defaultValue: 'Messages' }),
        path: ROUTES.MESSAGES.CONVERSATIONS,
        count: unreadCounts?.total,
        additionalPath: [ROUTES.MESSAGES.CHAT, ROUTES.MESSAGES.COMMUNITY_CHAT, ROUTES.MESSAGES.GENERAL_CHAT],
      },
      {
        icon: icons.communities,
        label: t('communities.title'),
        // Show invites tab if there are pending invites
        path: pendingInvitesCount > 0 ? ROUTES.COMMUNITIES.INVITES : ROUTES.COMMUNITIES.LIST,
        count: pendingInvitesCount,
        additionalPath: [
          ROUTES.COMMUNITIES.INVITES,
          ROUTES.COMMUNITIES.LIST,
          ROUTES.COMMUNITIES.DETAIL,
          ROUTES.COMMUNITIES.TABS.TOOLS,
          ROUTES.COMMUNITIES.NEW,
        ],
      },
      { icon: icons.users, label: t('user.list_title'), path: ROUTES.USERS.LIST },
    ],
    [t, pendingRatingsCount, pendingRequestsCount, pendingInvitesCount, unreadCounts?.total]
  )

  return (
    <motion.div
      animate={{ width: isCollapsed ? '70px' : '250px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        zIndex: 4,
        overflow: 'hidden',
      }}
    >
      <Flex
        direction={'column'}
        px={2}
        pt={5}
        h='100%'
        minH={'91vh'}
        bg={bgColor}
        borderRight={'1px solid '}
        borderColor={borderColor}
      >
        {/* Menu Items */}
        {menuItems.map((item) => (
          <SideNavMenuItem key={item.label} {...item} isCollapsed={isCollapsed} />
        ))}
        {/* Toggle Button */}
        <Flex justify={isCollapsed ? 'center' : 'flex-end'} mb={4}>
          <IconButton
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            icon={<Icon as={isCollapsed ? FiChevronsRight : FiChevronsLeft} />}
            size='sm'
            variant='ghost'
            onClick={() => setIsCollapsed(!isCollapsed)}
            _hover={{
              bg: useColorModeValue('gray.100', 'gray.700'),
            }}
          />
        </Flex>
      </Flex>
    </motion.div>
  )
}

type SidenavMenuItemProps = {
  icon: IconType
  label: string
  path: string
  count?: number
  additionalPath?: string[]
  isCollapsed?: boolean
}

const SideNavMenuItem = (item: SidenavMenuItemProps) => {
  const location = useLocation()
  const selectedBg = useColorModeValue('primary.50', 'primary.900')
  const selectedColor = useColorModeValue('primary.600', 'primary.200')
  const hoverBg = useColorModeValue('primary.100', 'primary.800')

  const isSelected = useMemo(() => {
    // Exact match for main path
    if (location.pathname === item.path) return true

    // Check additional paths with support for dynamic routes
    return (
      item?.additionalPath?.some((path) => {
        // First try exact match for static routes
        if (path === location.pathname) return true

        // Then try dynamic matching for routes with parameters
        const match = matchPath(
          {
            path: path,
          },
          location.pathname
        )
        return !!match
      }) || false
    )
  }, [location, item])

  if (item.isCollapsed) {
    return (
      <Flex
        as={RouterLink}
        to={item.path}
        align='center'
        justify='start'
        p={2}
        mx={0}
        borderRadius='lg'
        role='group'
        cursor='pointer'
        bg={isSelected ? selectedBg : 'transparent'}
        color={isSelected ? selectedColor : 'inherit'}
        _hover={{
          bg: isSelected ? selectedBg : hoverBg,
        }}
        mb={2}
        fontSize={18}
        position='relative'
        title={item.label}
        minH={'43px'}
      >
        <BadgeIcon icon={item.icon} aria-label={item.label} count={item.count} iconProps={{ boxSize: 5 }} />
      </Flex>
    )
  }

  return (
    <Flex
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
        bg: isSelected ? selectedBg : hoverBg,
      }}
      mb={2}
      fontSize={18}
      title={item.label}
    >
      <Icon mr={4} as={item.icon} color={isSelected ? selectedColor : 'inherit'} />
      <BadgeCounter
        count={item?.count}
        badgeProps={{
          top: '-4px',
          right: '-20px',
        }}
      >
        <Text whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' maxW='100%'>
          {item.label}
        </Text>
      </BadgeCounter>
    </Flex>
  )
}

export const DashboardLayout = () => {
  const isDashboardLayout = useIsDashboardBigLayout()
  return (
    <Flex>
      {isDashboardLayout && <SideNav />}
      <Box w={'100vw'}>
        <Outlet />
      </Box>
    </Flex>
  )
}

export const useIsDashboardBigLayout = () => useBreakpointValue({ base: false, md: true })
