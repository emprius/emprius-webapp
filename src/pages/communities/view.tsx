import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { Link as RouterLink, useOutletContext } from 'react-router-dom'
import { useCommunityInvites, useDefaultUserCommunities, useUserCommunities } from '~components/communities/queries'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'
import { ROUTES } from '~src/router/routes'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'
import { CommunitiesList } from '~components/communities/List'
import { CommunityInvites } from '~components/communities/Invites'
import { Button } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'

export const View = () => {
  const { pendingInvitesCount } = usePendingActions()
  const { t } = useTranslation()
  const { setData } = useOutletContext<TitlePageLayoutContext>()
  const { data: invitesData, isLoading: isInvitesLoading } = useCommunityInvites()

  useEffect(() => {
    setData(
      t('communities.title'),
      <Button as={RouterLink} to={ROUTES.COMMUNITIES.NEW} leftIcon={<FiPlus />} colorScheme='primary'>
        {t('communities.create_community')}
      </Button>
    )
  }, [setData, t])

  // Show invites tab only if there are pending invites
  const hasInvites = !isInvitesLoading && invitesData && invitesData.length > 0

  const tabs: TabConfig[] = [
    {
      path: ROUTES.COMMUNITIES.LIST,
      label: t('communities.your_communities'),
      content: <CommunitiesList />,
    },
    {
      path: ROUTES.COMMUNITIES.INVITES,
      label: <BadgeCounter count={pendingInvitesCount}>{t('communities.pending_invites')}</BadgeCounter>,
      content: <CommunityInvites />,
      hidden: !hasInvites,
    },
  ]

  // If there are invites, show the invites tab by default, otherwise show the communities list
  const defaultPath = hasInvites ? ROUTES.COMMUNITIES.INVITES : ROUTES.COMMUNITIES.LIST

  return <RoutedTabs tabs={tabs} defaultPath={defaultPath} />
}
