import { EditIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { BiWallet } from 'react-icons/bi'
import { FiMail } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { Avatar } from '~components/Images/Avatar'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import ErrorComponent from '~components/Layout/ErrorComponent'
import { ResponsiveSimpleGrid } from '~components/Layout/LayoutComponents'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { MapMarker } from '~components/Layout/MapMarker'
import { RatingCard } from '~components/Ratings/Card'
import { useGetReceivedRatings, useGetSubmittedRatings } from '~components/Ratings/queries'
import { ShowRatingStars } from '~components/Ratings/ShowRatingStars'
import { Rating } from '~components/Ratings/types'
import { UserProfile as UserProfileType } from '~components/Users/types'
import { ROUTES } from '~src/router/routes'
import { lightText } from '~theme/common'
import { icons } from '~theme/icons'

export const UserProfile = (user: UserProfileType) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const tabBg = useColorModeValue('white', 'gray.800')
  const { user: currentUser } = useAuth()
  const isCurrentUser = user.id === currentUser?.id

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor}>
      <Stack spacing={6}>
        <HStack justify={'space-between'} align={'start'}>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={6} align={{ base: 'center', sm: 'flex-start' }}>
            <Avatar username={user.name} avatarHash={user.avatarHash} />
            <Stack spacing={1}>
              <Stack direction='row' align='center' spacing={2}>
                <Heading size='lg'>{user.name}</Heading>
                <Badge colorScheme={user.active ? 'green' : 'gray'} ml={2}>
                  {user.active ? t('user.active') : t('user.inactive')}
                </Badge>
              </Stack>
              <ShowRatingStars rating={user.rating} size='sm' />
              <Stack direction='row' align='center' spacing={2} sx={lightText}>
                <FiMail />
                <Text>{user.email}</Text>
              </Stack>
              <Stack direction='row' align='center' spacing={2} sx={lightText}>
                <BiWallet />
                <Text>
                  {user.tokens} {t('common.token_symbol')}
                </Text>
              </Stack>
            </Stack>
          </Stack>
          {isCurrentUser && (
            <Button
              aria-label={t('common.edit')}
              rightIcon={<EditIcon />}
              size='md'
              variant='ghost'
              onClick={() => navigate(ROUTES.PROFILE.EDIT)}
            >
              {t('user.edit_profile')}
            </Button>
          )}
        </HStack>
        {user.location && (
          <Box mt={4} height='200px' width='100%' borderRadius='md' overflow='hidden'>
            <MapMarker {...user.location} />
          </Box>
        )}
      </Stack>

      {isCurrentUser && <UserRatings />}
    </Box>
  )
}

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
    <ResponsiveSimpleGrid>
      {data.map((rating: Rating, index) => (
        <RatingCard key={index} rating={rating} userId={isSubmited ? rating.fromUserId : rating.toUserId} />
      ))}
    </ResponsiveSimpleGrid>
  )
}

const UserRatings = () => {
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
