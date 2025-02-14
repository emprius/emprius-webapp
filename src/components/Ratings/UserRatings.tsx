import { Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { RatingCard } from '~components/Ratings/Card'
import { useGetReceivedRatings, useGetSubmittedRatings } from '~components/Ratings/queries'
import { Rating } from '~components/Ratings/types'
import { icons } from '~theme/icons'

const RatingSection = ({
  data,
  isLoading,
  error,
  emptyTitle,
  isSubmited = false,
  emptyDesc,
}: {
  data: Rating[] | undefined
  isLoading: boolean
  error: Error | string | null
  emptyTitle: string
  emptyDesc: string
  isSubmited?: boolean
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
    <VStack spacing={0} align="stretch" divider={<Box borderBottomWidth="1px" borderColor="gray.200" />}>
      {data.map((rating: Rating, index) => (
        <RatingCard key={index} rating={rating} userId={isSubmited ? rating.fromUserId : rating.toUserId} />
      ))}
    </VStack>
  )
}
export const UserRatings = () => {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = React.useState(0)

  return (
    <Box mt={6}>
      <Heading size='md' mb={4}>
        {t('rating.ratings')}
      </Heading>
      <Tabs isLazy index={tabIndex} onChange={setTabIndex}>
        <TabList>
          <Tab>{t('rating.submitted')}</Tab>
          <Tab>{t('rating.received')}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={1}>
            <SubmittedRatings />
          </TabPanel>
          <TabPanel px={1}>
            <ReceivedRatings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
const SubmittedRatings = () => {
  const query = useGetSubmittedRatings()
  return (
    <RatingSection
      {...query}
      emptyTitle='rating.no_submitted_ratings'
      emptyDesc='rating.no_submitted_ratings_desc'
      isSubmited
    />
  )
}
const ReceivedRatings = () => {
  const query = useGetReceivedRatings()
  return (
    <RatingSection {...query} emptyTitle='rating.no_received_ratings' emptyDesc='rating.no_received_ratings_desc' />
  )
}
