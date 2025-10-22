import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { BadgeIcon } from '~components/Layout/BadgeIcon'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { IconType } from 'react-icons'
import { useUnreadMessageCounts } from '~components/Messages/queries'

type MenuItem = {
  icon: IconType
  path: string
  count?: number
  central?: boolean
  additionalPath?: string[]
}

export const BOTTOM_NAV_HEIGHT = '60px'

export const BottomNav = () => {
  const { pendingRatingsCount, pendingRequestsCount, pendingInvitesCount } = usePendingActions()
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const location = useLocation()
  const selectedColor = useColorModeValue('primary.600', 'primary.200')
  const { data: unreadCounts } = useUnreadMessageCounts()

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { icon: icons.search, path: ROUTES.SEARCH },
      { icon: icons.tools, path: ROUTES.TOOLS.LIST },
      { icon: icons.add, path: ROUTES.TOOLS.NEW, central: true },
      {
        icon: icons.loan,
        path: ROUTES.BOOKINGS.REQUESTS,
        count: pendingRequestsCount,
        additionalPath: [ROUTES.BOOKINGS.PETITIONS], // This menu item can be selected on two different paths
      },
      {
        icon: icons.messages,
        label: t('messages.title', { defaultValue: 'Messages' }),
        path: ROUTES.MESSAGES.CONVERSATIONS,
        count: unreadCounts?.total,
        additionalPath: [ROUTES.MESSAGES.CHAT, ROUTES.MESSAGES.COMMUNITY_CHAT, ROUTES.MESSAGES.GENERAL_CHAT],
      },
    ],
    [t, pendingRatingsCount, pendingRequestsCount, pendingInvitesCount, unreadCounts?.total]
  )

  return (
    <Flex
      position='fixed'
      bottom={0}
      left={0}
      right={0}
      h={BOTTOM_NAV_HEIGHT}
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
          location.pathname === item.path || item?.additionalPath?.some((path) => path === location.pathname)
            ? selectedColor
            : 'inherit'

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
