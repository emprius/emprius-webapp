import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TitlePageLayoutContext } from '~src/pages/TitlePageLayout'
import { useOutletContext, useLocation, useSearchParams } from 'react-router-dom'
import { useGetPendingRatings, useGetUserRatings } from '~components/Ratings/queries'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { icons } from '~theme/icons'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { PendingRatingCard } from '~components/Ratings/PendingRatingCard'
import { UserRatingCard } from '~components/Ratings/UserRatingCard'
import { Booking } from '~components/Bookings/queries'
import { RoutedTabs, TabConfig } from '~components/Layout/RoutedTabs'
import { ROUTES } from '~src/router/routes'
import { usePendingActions } from '~components/Layout/Contexts/PendingActionsProvider'
import { BadgeCounter } from '~components/Layout/BadgeIcon'
import {
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Icon,
  Flex,
  Box,
} from '@chakra-ui/react'
import { useAuth } from '~components/Auth/AuthContext'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { BiSolidParty } from 'react-icons/bi'

const PendingRatings = () => {
  const { t } = useTranslation()
  const { isLoading, error, data } = useGetPendingRatings()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  if (!data?.length) {
    return (
      <ElementNotFound
        icon={icons.ratings}
        title={t('rating.no_pending_ratings')}
        desc={t('rating.no_pending_ratings_desc')}
      />
    )
  }

  return (
    <ResponsiveSimpleGrid columns={{ base: 1, sm: 2, md: 2, xl: 3 }}>
      {data.map((booking: Booking, index) => (
        <PendingRatingCard key={index} {...booking} />
      ))}
    </ResponsiveSimpleGrid>
  )
}

const RatingHistory = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isLoading, error, data } = useGetUserRatings(user.id)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  // Filter out ratings where no one has rated
  // todo(kon): should be deleted after https://github.com/emprius/emprius-app-backend/issues/60
  const ratingsWithContent =
    data?.filter((rating) => rating.owner.rating !== null || rating.requester.rating !== null) || []

  if (!ratingsWithContent.length) {
    return (
      <ElementNotFound
        icon={icons.ratings}
        title={t('rating.no_ratings_history')}
        desc={t('rating.no_ratings_history_desc')}
      />
    )
  }

  return (
    <Stack spacing={4}>
      {ratingsWithContent.map((rating, index) => (
        <UserRatingCard key={index} rating={rating} actualUser={user.id} />
      ))}
    </Stack>
  )
}

// Success Modal component
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const toolName = searchParams.get('toolName') || ''
  // Convert rating from 1-5 scale to 0-100 scale for ShowRatingStars
  const ratingValue = parseInt(searchParams.get('rating') || '0')
  const rating = ratingValue * 20 // Convert from 1-5 scale to 0-100 scale

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('rating.submit_success')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex direction='column' align='center' gap={4}>
            <Box color='green.500' fontSize='4xl'>
              <Icon as={BiSolidParty} />
            </Box>
            <Text fontWeight='bold' textAlign='center' mb={2}>
              {t('rating.your_rating_for', { toolName }) || `Your rating for ${toolName} was submitted successfully`}
            </Text>
            <ShowRatingStars rating={rating} size='lg' />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const View = () => {
  const { pendingRatingsCount } = usePendingActions()
  const { t } = useTranslation()
  const { setTitle } = useOutletContext<TitlePageLayoutContext>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Shows success modal when redirected from rating submission
  useEffect(() => {
    if (searchParams.get('submitted') === 'true') {
      setShowSuccessModal(true)
      // We don't remove the parameters here to allow the modal to access them
      // They will be removed when the modal is closed
    }
  }, [searchParams, setSearchParams])

  // Handle modal close and clean up URL parameters
  const handleModalClose = () => {
    setShowSuccessModal(false)
    // Remove the query parameters to prevent showing the modal on refresh
    searchParams.delete('submitted')
    searchParams.delete('toolName')
    searchParams.delete('rating')
    setSearchParams(searchParams)
  }

  useEffect(() => {
    setTitle(t('rating.ratings'))
  }, [setTitle, t])

  const tabs: TabConfig[] = [
    {
      path: ROUTES.RATINGS.PENDING,
      label: <BadgeCounter count={pendingRatingsCount}> {t('rating.pending_ratings')}</BadgeCounter>,
      content: <PendingRatings />,
    },
    {
      path: ROUTES.RATINGS.HISTORY,
      label: t('rating.ratings_history'),
      content: <RatingHistory />,
    },
  ]

  return (
    <>
      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />
      <RoutedTabs tabs={tabs} defaultPath={ROUTES.RATINGS.PENDING} />
    </>
  )
}
