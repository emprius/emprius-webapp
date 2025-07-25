import { Box, Link, Text, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '~src/router/routes'
import React from 'react'
import { Tool, ToolDetail } from '~components/Tools/types'
import { UserProfile } from '~components/Users/types'
import { calculateDistance } from '~src/utils'
import { useAuth } from '~components/Auth/AuthContext'
import { BookingForm } from '~components/Bookings/Form'
import { convertToDate } from '~utils/dates'

type CannotBookCase =
  | 'isOwner'
  | 'isNotInCommunity'
  | 'isTooFarAway'
  | 'userNotActive'
  | 'selfUserNotActive'
  | 'isAlreadyHeld'
  | null

type CanBook = { canBook: boolean; why: CannotBookCase }

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
    case 'isAlreadyHeld':
      return (
        <CannotBookInfoCard
          title={t('bookings.tool_already_held', { defaultValue: 'You are already holding this tool' })}
          description={t('bookings.tool_already_held_desc', {
            defaultValue:
              'You are the actual holder of this tool! Other users will send booking requests to you if they need the tool',
          })}
        />
      )
    case 'selfUserNotActive':
      return (
        <CannotBookInfoCard
          title={t('bookings.self_user_is_not_active', { defaultValue: 'Your profile is not active' })}
          description={t('bookings.self_user_is_not_active_desc', {
            defaultValue:
              'If you want to book a tool your profile must be active. Change your profile settings to activate it',
          })}
        />
      )
    case 'userNotActive':
      return (
        <CannotBookInfoCard
          title={t('bookings.user_is_not_active', { defaultValue: 'The user is not active' })}
          description={t('bookings.user_is_not_active_desc', {
            defaultValue:
              'The tool holder have deactivated their profile. You cannot book this tool until they reactivate it.',
          })}
        />
      )

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
      <Text color='lightText' mb={4}>
        {title}
      </Text>
      {description && (
        <Text mb={4} color='lightText'>
          {description}
        </Text>
      )}
      <Link as={RouterLink} to={buttonLink ?? ROUTES.SEARCH} color='primary.500' fontWeight='medium'>
        {buttonText ?? t('tools.find_other')}
      </Link>
    </Box>
  )
}

export const canUserBookTool = (tool: ToolDetail, user: UserProfile): CanBook => {
  const isOwner = tool.userId === user.id
  const isActualUser = tool.actualUserId === user.id

  // User is already holding the tool
  if (tool.isNomadic && isActualUser) {
    return { canBook: false, why: 'isAlreadyHeld' }
  }

  // Self user not active
  if (!user.active) {
    return { canBook: false, why: 'selfUserNotActive' }
  }

  // User is not active
  if (!tool.userActive || tool?.actualUserActive === false) {
    return { canBook: false, why: 'userNotActive' }
  }

  // Tool is not nomadic and user is the owner
  if (!tool.isNomadic && isOwner) {
    return { canBook: false, why: 'isOwner' }
  }

  // Tool is nomadic, has no actual user, and user is the owner
  if (tool.isNomadic && !tool.actualUserId && isOwner) {
    return { canBook: false, why: 'isOwner' }
  }

  const isCommunityParticipant = tool.communities?.length
    ? user.communities?.some(({ id }) => tool.communities?.includes(id))
    : true

  // Tool belongs to a community and user is not a participant
  if (tool.communities?.length > 0 && !isCommunityParticipant) {
    return { canBook: false, why: 'isNotInCommunity' }
  }

  // Tool is too far away
  if (tool?.maxDistance && tool?.maxDistance < calculateDistance(user.location, tool.location)) {
    return { canBook: false, why: 'isTooFarAway' }
  }

  // All checks passed → can book
  return { canBook: true, why: null }
}
