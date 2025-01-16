import { Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { FiStar } from 'react-icons/fi'
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
      <Stack direction='row' align='center' color='orange.400'>
        <FiStar />
        <Text>{rating?.toFixed(1) || '-'}</Text>
      </Stack>
    </Stack>
  )
}
