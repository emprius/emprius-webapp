import { Card, CardBody } from '@chakra-ui/react'
import React from 'react'
import { RatingsForm } from '~components/Ratings/Form'
import { useMutationState } from '@tanstack/react-query'
import { Booking } from '~components/Bookings/types'

export const PendingRatingCard = (booking: Booking) => {
  // Check last mutation for this rating to see if there was an error
  const mutations = useMutationState({
    filters: { mutationKey: ['ratings', 'submit', booking.id] },
    select: (mutation) => mutation.state,
  })
  const isError = mutations[mutations.length - 1]?.error

  return (
    <Card variant={isError ? 'error' : 'elevated'}>
      <CardBody>
        <RatingsForm booking={booking} />
      </CardBody>
    </Card>
  )
}
