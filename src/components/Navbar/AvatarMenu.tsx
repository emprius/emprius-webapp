import { Box, Divider, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Stack } from '@chakra-ui/react'
import { BadgeCounter, BadgeIcon } from '~components/Layout/BadgeIcon'
import { icons } from '~theme/icons'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'
import { FiSettings } from 'react-icons/fi'
import { LogoutBtn } from '~components/Layout/LogoutBtn'
import React from 'react'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { useUnreadMessageCounts } from '~components/Messages/queries'
import { useTranslation } from 'react-i18next'
import { avatarSizeToPixels, UserAvatar } from '~components/Images/Avatar'
import { useAuth } from '~components/Auth/AuthContext'
import { UserCard } from '~components/Users/Card'
import DonateButton from '~components/Layout/DonateButton'
import { LanguageSwitcher } from '~components/Navbar/LanguageSwitcher'
import ColorModeSwitcher from '~components/Navbar/ColorModeSwitcher'

type LittleScreensMenuProps = {}

const AvatarMenu = ({}: LittleScreensMenuProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { pendingRatingsCount, pendingRequestsCount, pendingInvitesCount } = usePendingActions()
  const { data: unreadCounts } = useUnreadMessageCounts()
  const hasCount = unreadCounts?.total > 0 || pendingRatingsCount > 0
  return (
    <Menu>
      <MenuButton minW={avatarSizeToPixels['sm']}>
        <BadgeCounter
          badgeProps={{
            right: -1,
            top: -1,
          }}
          emptyBadge={hasCount}
        >
          <UserAvatar size='sm' id={user?.id} />
        </BadgeCounter>
      </MenuButton>
      <MenuList>
        <UserCard
          userId={user?.id}
          placeholderData={user}
          showAvatar={false}
          showBorder={false}
          showKarma={true}
          userNameFirst
          to={ROUTES.PROFILE.VIEW}
        />
        <Divider />
        {/*<Box display={{ base: 'block', md: 'none' }}>*/}
        <Box>
          <MenuItem
            as={RouterLink}
            to={pendingRatingsCount > 0 ? ROUTES.RATINGS.PENDING : ROUTES.RATINGS.HISTORY}
            icon={icons.ratings({})}
          >
            <BadgeCounter
              aria-label={t('nav.ratings')}
              count={pendingRatingsCount}
              w={'min-content'}
              badgeProps={{
                right: -5,
                top: -1,
              }}
            >
              {t('nav.ratings')}
            </BadgeCounter>
          </MenuItem>
          <MenuItem
            as={RouterLink}
            to={pendingInvitesCount > 0 ? ROUTES.COMMUNITIES.INVITES : ROUTES.COMMUNITIES.LIST}
            icon={icons.communities({})}
          >
            <BadgeCounter
              count={pendingInvitesCount}
              w={'min-content'}
              badgeProps={{
                right: -5,
                top: -1,
              }}
            >
              {t('communities.title', { defaultValue: 'Communities' })}
            </BadgeCounter>
          </MenuItem>
          <MenuItem as={RouterLink} to={ROUTES.USERS.LIST} icon={icons.users({})}>
            {t('user.list_title')}
          </MenuItem>
          <MenuItem as={RouterLink} to={ROUTES.PROFILE.EDIT} icon={<FiSettings />}>
            {t('nav.settings')}
          </MenuItem>
        </Box>
        <Divider />
        <MenuItem as={RouterLink} to={`${ROUTES.PROFILE.VIEW}#invite-codes`} icon={<Icon as={icons.add} />}>
          {t('profile.invite_people', { defaultValue: 'Invite people' })}
        </MenuItem>
        <Divider />
        <LogoutBtn as={MenuItem} borderRadius={0} display={'flex'} justifyContent={'start'} pl={3} />
        <Divider />
        <Stack direction='row' spacing={0} align='center' justify={{ base: 'space-between', sm: 'end' }}>
          <Box display={{ base: 'block', sm: 'none' }} ml={3}>
            <DonateButton onlyIcon={false} ml={0} size={'sm'} />
          </Box>
          <Box>
            <LanguageSwitcher iconOnly />
            <ColorModeSwitcher />
          </Box>
        </Stack>
      </MenuList>
    </Menu>
  )
}

export default AvatarMenu
