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
import { RatingComments } from '~components/Ratings/RatingComments'

interface UnifiedRatingCardProps {
  rating: UnifiedRating
  actualUser: string
}

export const UserRatingCard = ({ rating, actualUser }: UnifiedRatingCardProps) => {
  const { t } = useTranslation()
  const { data: booking, isLoading: isLoadingBooking } = useBookingDetail({ id: rating.bookingId })
  const { data: tool, isLoading: isLoadingTool } = useTool(rating?.toolId, {
    enabled: !!rating?.toolId,
  })

  const isOwner = rating.owner.id === actualUser
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

  const link = ROUTES.BOOKINGS.DETAIL.replace(':id', rating.bookingId)

  return (
    <Card variant='outline' mb={4} borderColor={borderColor} _hover={{ bg: bgHover }} transition='background 0.2s'>
      <CardBody>
        {/* Header with tool info */}
        <Flex gap={4} align='start' mb={4}>
          <Box width='50px' height='50px' borderRadius='md' overflow='hidden'>
            <ToolImage
              imageId={tool?.images?.[0]}
              alt={tool?.title}
              toolId={tool?.id}
              width='100%'
              height='100%'
              isLoading={isLoadingTool}
            />
          </Box>

          <Box flex='1'>
            <HStack fontSize='sm' fontWeight='medium' mb={1} wrap={'wrap'}>
              <RouterLink
                to={link}
                state={{
                  booking,
                  tool,
                }}
              >
                <HStack wrap={'wrap'}>
                  <Icon as={isOwner ? icons.outbox : icons.inbox} color='lighterText' />
                  {titleText}
                </HStack>
              </RouterLink>
              <UserCard
                userId={otherUser.id}
                direction={'row'}
                avatarSize={'2xs'}
                showRating={false}
                borderWidth={0}
                p={0}
                gap={1}
                bgColor={'transparent'}
                alignItems={'center'}
              />
            </HStack>
            <Skeleton isLoaded={!isLoadingBooking} maxW={'250px'}>
              {booking && (
                <RouterLink
                  to={link}
                  state={{
                    booking,
                    tool,
                  }}
                >
                  <Text fontSize='xs' color='gray.500'>
                    {format(new Date(booking.startDate * 1000), datef)} -{' '}
                    {format(new Date(booking.endDate * 1000), datef)}
                  </Text>
                </RouterLink>
              )}
            </Skeleton>
          </Box>
        </Flex>
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
