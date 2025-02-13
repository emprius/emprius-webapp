import { Tab, TabList, TabPanel, TabPanels, Tabs, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { ROUTES } from '~src/router/routes'
import { icons } from '~theme/icons'
import { RatingCard } from './Card'
import { useGetPendingRatings, useGetReceivedRatings, useGetSubmittedRatings } from './queries'
import { Rating } from './types'

export const RatingsList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const [tabIndex, setTabIndex] = React.useState(() => {
    if (location.pathname === ROUTES.RATINGS.SUBMITTED) return 1
    if (location.pathname === ROUTES.RATINGS.RECEIVED) return 2
    return 0
  })

  useEffect(() => {
    if (location.pathname === ROUTES.RATINGS.SUBMITTED) {
      setTabIndex(1)
    } else if (location.pathname === ROUTES.RATINGS.RECEIVED) {
      setTabIndex(2)
    } else {
      setTabIndex(0)
    }
  }, [location.pathname])

  const handleTabChange = (index: number) => {
    setTabIndex(index)
    switch (index) {
      case 0:
        navigate(ROUTES.RATINGS.PENDING)
        break
      case 1:
        navigate(ROUTES.RATINGS.SUBMITTED)
        break
      case 2:
        navigate(ROUTES.RATINGS.RECEIVED)
        break
    }
  }

  return (
    <Tabs isLazy index={tabIndex} onChange={handleTabChange}>
      <TabList>
        <Tab>{t('rating.pending')}</Tab>
        <Tab>{t('rating.submitted')}</Tab>
        <Tab>{t('rating.received')}</Tab>
      </TabList>

      <TabPanels>
        <TabPanel px={1}>
          <PendingRatings />
        </TabPanel>
        <TabPanel px={1}>
          <SubmittedRatings />
        </TabPanel>
        <TabPanel px={1}>
          <ReceivedRatings />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

const PendingRatings = () => {
  const query = useGetPendingRatings()
  return <RatingSection {...query} emptyTitle='rating.no_pending_ratings' emptyDesc='rating.no_pending_ratings_desc' />
}

const SubmittedRatings = () => {
  const query = useGetSubmittedRatings()
  return (
    <RatingSection {...query} emptyTitle='rating.no_submitted_ratings' emptyDesc='rating.no_submitted_ratings_desc' />
  )
}

const ReceivedRatings = () => {
  const query = useGetReceivedRatings()
  return (
    <RatingSection {...query} emptyTitle='rating.no_received_ratings' emptyDesc='rating.no_received_ratings_desc' />
  )
}

const RatingSection = ({
  data,
  isLoading,
  error,
  emptyTitle,
  emptyDesc,
}: {
  data: Rating[] | undefined
  isLoading: boolean
  error: Error | string | null
  emptyTitle: string
  emptyDesc: string
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  if (!data?.length) {
    return <ElementNotFound icon={icons.ratings} title={t(emptyTitle)} desc={t(emptyDesc)} />
  }

  return (
    <ResponsiveSimpleGrid>
      {data.map((rating: Rating, index) => (
        <RatingCard key={index} {...rating} />
      ))}
    </ResponsiveSimpleGrid>
  )
}
