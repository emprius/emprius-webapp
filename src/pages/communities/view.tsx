import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useOutletContext } from 'react-router-dom'
import { useCommunityInvites, useCommunities } from '~components/communities/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'
import { ROUTES } from '~src/router/routes'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'
import { CommunitiesList } from '~components/communities/List'
import { CommunityInvites } from '~components/communities/Invites'

const CommunitiesListView = () => {
  const { t } = useTranslation()
  const { isLoading, isError, error, data } = useCommunities()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <ElementNotFound
        icon={icons.users}
        title={t('common.error')}
        desc={t('common.something_went_wrong')}
      />
    )
  }

  if (!data?.communities || data.communities.length === 0) {
    return (
      <ElementNotFound
        icon={icons.users}
        title={t('communities.no_communities')}
        desc={t('communities.no_communities_desc')}
      />
    )
  }

  return <CommunitiesList />
}

const CommunityInvitesView = () => {
  return <CommunityInvites />
}

export const View = () => {
  const { pendingInvitesCount } = usePendingActions()
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()
  const { data: invitesData, isLoading: isInvitesLoading } = useCommunityInvites()

  useEffect(() => {
    setTitle(t('communities.title'))
  }, [setTitle, t])

  // Show invites tab only if there are pending invites
  const hasInvites = !isInvitesLoading && invitesData?.invites && invitesData.invites.length > 0

  const tabs: TabConfig[] = [
    {
      path: ROUTES.COMMUNITIES.LIST,
      label: t('communities.your_communities'),
      content: <CommunitiesListView />,
    },
    {
      path: ROUTES.COMMUNITIES.INVITES,
      label: <BadgeCounter count={pendingInvitesCount}>{t('communities.pending_invites')}</BadgeCounter>,
      content: <CommunityInvitesView />,
      hidden: !hasInvites,
    },
  ]

  // If there are invites, show the invites tab by default, otherwise show the communities list
  const defaultPath = hasInvites ? ROUTES.COMMUNITIES.INVITES : ROUTES.COMMUNITIES.LIST

  return <RoutedTabs tabs={tabs} defaultPath={defaultPath} />
}
