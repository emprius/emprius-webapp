import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Circle,
  Divider,
  HStack,
  Skeleton,
} from '@chakra-ui/react'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { FiCalendar, FiMapPin, FiUser } from 'react-icons/fi'
import { ElementNotFound } from '~components/Layout/ElementNotFound'
import { LoadingSpinner } from '~components/Layout/LoadingSpinner'
import { MapWithMarker } from '~components/Layout/Map/Map'
import { useToolHistory } from '~components/Tools/queries'
import { lightText, lighterText } from '~theme/common'
import { icons } from '~theme/icons'
import { UserCard } from '~components/Users/Card'
import { format } from 'date-fns'

interface ToolHistoryProps {
  toolId: string
}

export const ToolHistory: React.FC<ToolHistoryProps> = ({ toolId }) => {
  const { t } = useTranslation()
  const { data: historyEntries, isLoading, isError } = useToolHistory(toolId)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const timelineColor = useColorModeValue('primary.500', 'primary.300')
  const circleColor = useColorModeValue('primary.500', 'primary.300')
  const circleBgColor = useColorModeValue('white', 'gray.800')

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' p={6}>
        <ElementNotFound
          icon={icons.tools}
          title={t('tools.history_error', { defaultValue: 'Error loading tool history' })}
          desc={t('tools.history_error_desc', { defaultValue: 'There was an error loading the tool history.' })}
        />
      </Box>
    )
  }

  if (historyEntries.length === 0) {
    return (
      <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' p={6}>
        <ElementNotFound
          icon={icons.tools}
          title={t('tools.no_history', { defaultValue: 'No history yet' })}
          desc={t('tools.no_history_desc', { defaultValue: 'This tool has not been borrowed yet.' })}
        />
      </Box>
    )
  }

  const datef = t('tools.nomadic_datef', { defaultValue: 'PP' })

  return (
    <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' p={6} w={'full'}>
      <Heading as='h3' size='md' mb={6}>
        {t('tools.nomadic_history', { defaultValue: 'Nomadic Tool History' })}
      </Heading>

      <VStack spacing={0} align='stretch' w={'full'}>
        {historyEntries.map((entry, index) => (
          <Flex key={entry.id} position='relative' w={'full'}>
            {/* Timeline line */}
            {index < historyEntries.length - 1 && (
              <Box
                position='absolute'
                left='15px'
                top='30px'
                bottom='-10px'
                width='2px'
                bg={timelineColor}
                zIndex={1}
              />
            )}

            {/* Timeline entry */}
            <Flex mb={6} w={'full'}>
              {/* Circle indicator */}
              <Circle size='30px' bg={circleBgColor} borderWidth='2px' borderColor={circleColor} mr={4} zIndex={2}>
                <Box as={icons.tools} color={circleColor} fontSize='sm' />
              </Circle>

              {/* Content */}
              <Box flex={1}>
                <HStack>
                  <Text fontSize='md'>{t('tools.nomadic_picked_by', { defaultValue: 'Picked up by' })}</Text>
                  <UserCard
                    userId={entry.userId}
                    direction={'row'}
                    avatarSize={'2xs'}
                    showRating={false}
                    borderWidth={0}
                    p={0}
                    gap={1}
                    bgColor={'transparent'}
                    placeholderData={{ name: entry.userName }}
                  />
                </HStack>
                <HStack>
                  <Text fontSize='sm' color='gray.500'>
                    {t('tools.nomadic_picked_by_date', {
                      defaultValue: 'On {{ date, format }}',
                      date: entry.pickupDate,
                      format: datef,
                    })}
                  </Text>
                </HStack>

                {/* Map */}
                <Box mt={3} w='full' height='150px' borderRadius='md' overflow='hidden'>
                  <MapWithMarker latLng={entry.location} markerProps={{ showExactLocation: false }} />
                </Box>
              </Box>
            </Flex>
          </Flex>
        ))}
      </VStack>
    </Box>
  )
}
