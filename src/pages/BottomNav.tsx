import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { usePendingActions } from '~components/InfoProviders/PendingActionsProvider'
import { BadgeIcon } from '~components/Layout/BadgeIcon'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'

export const BottomNav = () => {
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
      { icon: icons.ratings, path: ROUTES.RATINGS.PENDING, count: pendingRatingsCount },
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
