import { Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { DisplayRating } from '../../Ratings/DisplayRating'
import { formatCurrency } from '~src/utils'

interface ToolPriceRatingProps {
  cost: number
  rating?: number
  direction?: 'row' | 'column'
  justify?: string
}

export const ToolPriceRating = ({
  cost,
  rating,
  direction = 'row',
  justify = 'space-between',
}: ToolPriceRatingProps) => {
  return (
    <Stack direction={direction} justify={justify} align='center'>
      <Text color='primary.500' fontWeight='bold'>
        {formatCurrency(cost)}/day
      </Text>
      <DisplayRating rating={rating || 0} size='sm' showCount={rating !== undefined} />
    </Stack>
  )
}
