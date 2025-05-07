import { Box, Link, Text, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { lightText } from '~theme/common'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'
import React from 'react'
import { Tool, ToolDetail } from '~components/Tools/types'
import { UserProfile } from '~components/Users/types'
import { calculateDistance } from '~src/utils'
import { useAuth } from '~components/Auth/AuthContext'
import { BookingForm } from '~components/Bookings/Form'
import { convertToDate } from '~utils/dates'

export const BookingFormWrapper = ({ tool, canBook }: { tool: Tool; canBook: CanBook }) => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <CannotBookInfoCard title={t('tools.login_to_book')} buttonText={t('nav.login')} buttonLink={ROUTES.AUTH.LOGIN} />
    )
  }

  if (!tool.isAvailable) {
    return <CannotBookInfoCard title={t('tools.not_available')} />
  }

  switch (canBook.why) {
    case 'isTooFarAway':
      return (
        <CannotBookInfoCard
          title={t('bookings.is_too_far_away', { defaultValue: 'The tool is to far away' })}
          description={t('bookings.is_too_far_away_desc', {
            defaultValue: 'Tool settings set a maximum loan distance',
          })}
        />
      )
    case 'isNotInCommunity':
      return (
        <CannotBookInfoCard
          title={t('bookings.you_are_not_community_member', { defaultValue: 'Yoy are not member of the community' })}
          description={t('bookings.not_community_member_description', {
            defaultValue: 'This tool belongs into a community and your are not member of it',
          })}
        />
      )
    case 'isNomadicBooked':
      return (
        <CannotBookInfoCard
          title={t('bookings.nomadic_tool_booked', { defaultValue: 'This nomadic tool is actually booked' })}
          description={t('bookings.not_community_member_description', {
            defaultValue: "Booking won't be available until the actual user finishes the booking",
          })}
        />
      )
  }

  if (!canBook.canBook) {
    return null
  }

  return <BookingForm tool={tool} />
}
const CannotBookInfoCard = ({
  title,
  description,
  buttonText,
  buttonLink,
}: {
  title: string
  description?: string
  buttonText?: string
  buttonLink?: string
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const { t } = useTranslation()
  return (
    <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm' textAlign='center'>
      <Text sx={lightText} mb={4}>
        {title}
      </Text>
      {description && (
        <Text color='gray.600' mb={4} sx={lightText}>
          {description}
        </Text>
      )}
      <Link as={RouterLink} to={buttonLink ?? ROUTES.SEARCH} color='primary.500' fontWeight='medium'>
        {buttonText ?? t('tools.find_other')}
      </Link>
    </Box>
  )
}
type CannotBookCase = 'isOwner' | 'isActualUser' | 'isNotInCommunity' | 'isTooFarAway' | 'isNomadicBooked' | null
type CanBook = { canBook: boolean; why: CannotBookCase }

export function canUserBookTool(tool: ToolDetail, user: UserProfile): CanBook {
  const isOwner = tool.userId === user.id
  const isActualUser = tool.actualUserId === user.id

  // Case 1: Tool is not nomadic and user is the owner → cannot book
  if (!tool.isNomadic && isOwner) {
    return { canBook: false, why: 'isOwner' }
  }

  // Case 2: Tool is nomadic and user is the actual user → cannot book
  if (tool.isNomadic && isActualUser) {
    return { canBook: false, why: 'isActualUser' }
  }

  // Case 3: Tool is nomadic, has no actual user, and user is the owner → cannot book
  if (tool.isNomadic && !tool.actualUserId && isOwner) {
    return { canBook: false, why: 'isOwner' }
  }

  const isCommunityParticipant = tool.communities?.length
    ? user.communities?.some(({ id }) => tool.communities?.includes(id))
    : true

  // Case 4: Tool belongs to a community and user is not a participant → cannot book
  if (tool.communities?.length > 0 && !isCommunityParticipant) {
    return { canBook: false, why: 'isNotInCommunity' }
  }

  // Case 5: Tool is too far away → cannot book
  if (tool?.maxDistance && tool?.maxDistance < calculateDistance(user.location, tool.location)) {
    return { canBook: false, why: 'isTooFarAway' }
  }

  // Case 6: is nomadic and is booked
  if (tool.isNomadic && tool.reservedDates?.length > 0) {
    const now = new Date()

    const isBooked = tool.reservedDates.some((date) => convertToDate(date.to) >= now)
    if (isBooked) {
      return { canBook: false, why: 'isNomadicBooked' }
    }
  }

  // All checks passed → can book
  return { canBook: true, why: null }
}
