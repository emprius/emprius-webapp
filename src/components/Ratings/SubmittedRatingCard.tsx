import React from 'react'
import { Box, Card, CardBody, Flex, HStack, Icon, Skeleton, Text, useColorModeValue } from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { useTool } from '~components/Tools/queries'
import { ROUTES } from '~src/router/routes'
import { UnifiedRating } from './types'
import { useBookingDetail } from '~components/Bookings/queries'
import { format } from 'date-fns'
import { UserCard } from '~components/Users/Card'
import { ToolImage } from '~components/Tools/shared/ToolImage'
import { icons } from '~theme/icons'
import { lighterText } from '~theme/common'
import { RatingComments } from '~components/Ratings/RatingComments'

interface UnifiedRatingCardProps {
  rating: UnifiedRating
}

export const SubmittedRatingCard = ({ rating }: UnifiedRatingCardProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: booking } = useBookingDetail({ id: rating.bookingId })
  const { data: tool } = useTool(booking?.toolId, {
    enabled: !!booking?.toolId,
  })

  const isOwner = rating.owner.id === user.id
  const otherUser = isOwner ? rating.requester : rating.owner
  const datef = t('rating.datef')

  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgHover = useColorModeValue('gray.50', 'gray.800')

  if (!rating.owner.rating && !rating.requester.rating) {
    return null // Don't show ratings where no one has rated
  }

  let titleText = (
    <Trans
      i18nKey={'rating.you_got_the_tool_from'}
      defaultValue={'You requested'}
      components={{
        toolName: <ToolName tool={tool} />,
      }}
    />
  )

  if (isOwner) {
    titleText = (
      <Trans
        i18nKey={'rating.you_lent_the_tool_from'}
        defaultValue={'You lent'}
        components={{
          toolName: <ToolName tool={tool} />,
        }}
      />
    )
  }

  return (
    <Card variant='outline' mb={4} borderColor={borderColor} _hover={{ bg: bgHover }} transition='background 0.2s'>
      <CardBody>
        <RouterLink
          to={ROUTES.BOOKINGS.DETAIL.replace(':id', rating.bookingId)}
          state={{
            booking,
            tool,
          }}
        >
          {/* Header with tool info */}
          <Flex gap={4} align='start' mb={4}>
            <Skeleton isLoaded={!!tool} width='50px' height='50px' borderRadius='md' overflow='hidden' flexShrink={0}>
              {tool?.images?.[0] && (
                <ToolImage
                  imageId={tool.images[0]}
                  alt={tool.title}
                  toolId={tool.id}
                  width='100%'
                  height='100%'
                  objectFit='cover'
                />
              )}
            </Skeleton>

            <Box flex='1'>
              <HStack fontSize='sm' fontWeight='medium' mb={1} wrap={'wrap'}>
                <Icon as={isOwner ? icons.outbox : icons.inbox} sx={lighterText} />
                {titleText}
                <UserCard
                  userId={otherUser.id}
                  direction={'row'}
                  avatarSize={'2xs'}
                  showRating={false}
                  borderWidth={0}
                  p={0}
                  gap={1}
                  bgColor={'transparent'}
                />
              </HStack>
              {booking && (
                <Text fontSize='xs' color='gray.500'>
                  {format(new Date(booking.startDate * 1000), datef)} -{' '}
                  {format(new Date(booking.endDate * 1000), datef)}
                </Text>
              )}
            </Box>
          </Flex>
        </RouterLink>
        <Box maxW={{ base: '100%', lg: '60%' }}>
          <RatingComments {...rating} />
        </Box>
      </CardBody>
    </Card>
  )
}

const ToolName = ({ tool }) => {
  if (!tool) {
    return <Skeleton ml={1} isLoaded={!!tool} w={10} h={4} display='inline-block' />
  }
  return (
    <Box as={'span'} color={'primary.500'}>
      {tool.title}
    </Box>
  )
}
