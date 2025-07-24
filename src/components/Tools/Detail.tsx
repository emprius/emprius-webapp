import {
  Badge,
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiBox, FiDollarSign, FiTag } from 'react-icons/fi'
import { LuWeight } from 'react-icons/lu'
import { useAuth } from '~components/Auth/AuthContext'
import { BookingFormData } from '~components/Bookings/Form'
import { useInfoContext } from '~components/Layout/Contexts/InfoContext'
import { ImageCarousel } from '~components/Images/ImageCarousel'
import { MapWithMarker } from '~components/Layout/Map/Map'
import { AvailabilityCalendar } from '~components/Tools/AvailabilityCalendar'
import { CostDay } from '~components/Tools/shared/CostDay'
import { AvailabilityToggle, EditToolButton } from '~components/Tools/shared/OwnerToolButtons'
import { ToolDetail as ToolDetailType } from '~components/Tools/types'
import { UserCard } from '~components/Users/Card'
import { ToolRatings } from '~components/Ratings/ToolRatingsCard'
import { ToolHistory } from '~components/Tools/ToolHistory'
import { FormProvider, useForm } from 'react-hook-form'
import { icons } from '~theme/icons'
import ToolTitle from '~components/Tools/shared/ToolTitle'
import { MdSocialDistance } from 'react-icons/md'
import { CommunityCardLittle } from '~components/Communities/Card'
import { BookingFormWrapper, canUserBookTool } from '~components/Tools/FormWrapper'
import NomadicBadge from '~components/Tools/shared/NomadicBadge'
import { IoCalculatorSharp } from 'react-icons/io5'

export const ToolDetail = ({ tool }: { tool: ToolDetailType }) => {
  const { t } = useTranslation()
  const { categories } = useInfoContext()
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.800')
  const { user } = useAuth()

  // Create form methods
  const formMethods = useForm<BookingFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      contact: '',
      comments: '',
    },
    mode: 'onChange',
  })

  const showActualUser = tool.actualUserId && tool.actualUserId !== tool.userId
  const canBook = useMemo(() => canUserBookTool(tool, user), [tool, user])

  let showExactLocation = user?.id === tool.userId
  if (showActualUser) {
    showExactLocation = user?.id === tool.actualUserId
  }

  return (
    <FormProvider {...formMethods}>
      <Container maxW='container.xl' py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <GridItem>
            <Stack spacing={8}>
              <Box bg={bgColor} borderWidth={1} borderColor={borderColor} borderRadius='lg' overflow='hidden'>
                {tool?.images?.length > 0 && <ImageCarousel imageIds={tool.images} height='400px' width='100%' />}

                <Stack p={6} spacing={6}>
                  <Stack spacing={4}>
                    <Stack spacing={1}>
                      <Stack
                        direction={{ base: 'column-reverse', md: 'row' }}
                        align={{ base: 'start', md: 'center' }}
                        justify='space-between'
                      >
                        <ToolTitle fontSize='3xl' fontWeight='bold' color={'primary.500'} tool={tool} />
                        <HStack>
                          {tool.isNomadic && <NomadicBadge px={2} py={1} />}
                          <Badge colorScheme={tool.isAvailable ? 'green' : 'gray'} px={2} py={1} borderRadius='full'>
                            {t(`tools.${tool.isAvailable ? 'available' : 'unavailable'}`)}
                          </Badge>
                        </HStack>
                      </Stack>
                      <CostDay
                        tool={tool}
                        color='lightText'
                        fontSize='2xl'
                        fontWeight='bold'
                        badgeProps={{
                          fontSize: '2xl',
                          fontWeight: 'bold',
                        }}
                      />
                    </Stack>
                    {tool?.description && <Text color='lightText'>{tool.description}</Text>}
                    <SimpleGrid spacing={4} columns={{ base: 2 }}>
                      {!!tool.toolCategory && (
                        <Stack direction='row' align='center'>
                          <FiTag size={20} />
                          <Text>{categories.find((c) => c.id === tool.toolCategory)?.name}</Text>
                        </Stack>
                      )}
                      {!!tool.toolValuation && (
                        <Stack direction='row' align='center'>
                          <FiDollarSign size={20} />
                          <Text>{t('tools.estimated_value', { value: tool.toolValuation })}</Text>
                        </Stack>
                      )}
                      {!!tool.estimatedDailyCost && (
                        <Stack direction='row' align='center'>
                          <IoCalculatorSharp size={20} />
                          <Text>{t('tools.estimated_daily_cost', { value: tool.estimatedDailyCost })}</Text>
                        </Stack>
                      )}

                      {!!tool.height && (
                        <Stack direction='row' align='center'>
                          <FiBox size={20} />
                          <Text>{tool.height && `${tool.height}cm`}</Text>
                        </Stack>
                      )}
                      {!!tool.weight && (
                        <Stack direction='row' align='center'>
                          <LuWeight size={20} />
                          <Text>{tool.weight && `${tool.weight}kg`}</Text>
                        </Stack>
                      )}
                      {!!tool.maxDistance && (
                        <Stack direction='row' align='center'>
                          <MdSocialDistance size={20} />
                          <Text>
                            {t('tools.max_distance')}: {tool.maxDistance}
                          </Text>
                        </Stack>
                      )}
                    </SimpleGrid>
                    {tool.isNomadic && (
                      <Flex direction={'column'} gap={1}>
                        <Stack direction='row' align='center'>
                          <Icon as={icons.nomadic} />
                          <Text>{t('tools.this_tool_is_nomadic', { defaultValue: 'This tool is nomadic' })}</Text>
                        </Stack>
                        <Text color='lighterText'>{t('tools.nomadic_description')}</Text>
                      </Flex>
                    )}
                    <Divider my={4} />
                    <>
                      <Text fontWeight='medium' mb={2} color='primary.500'>
                        {t('common.owner')}
                      </Text>
                      <UserCard userId={tool.userId} borderWidth={0} p={0} />
                    </>
                    {showActualUser && (
                      <>
                        <Text fontWeight='medium' mb={2} color='primary.500'>
                          {t('tools.current_holder', { defaultValue: 'Current Holder' })}{' '}
                          <Text as='span' fontWeight='normal' color='gray.500' fontSize='sm'>
                            (
                            {t('tools.nomadic_owner_desc', {
                              defaultValue: 'Person who is holding the nomadic tool right now',
                            })}
                            )
                          </Text>
                        </Text>
                        <UserCard userId={tool.actualUserId} borderWidth={0} p={0} />
                      </>
                    )}
                    {tool?.communities && (
                      <Stack>
                        <Text fontWeight='medium' mb={2} color='primary.500'>
                          {t('communities.tool_of_communities', { defaultValue: 'Communities' })}
                        </Text>
                        <SimpleGrid minChildWidth='200px' spacing={1}>
                          {tool?.communities?.map((id) => <CommunityCardLittle key={id} id={id} p={0} />)}
                        </SimpleGrid>
                      </Stack>
                    )}
                    {tool.location && (
                      <Box mt={4} height='200px' borderRadius='lg' overflow='hidden'>
                        <MapWithMarker
                          latLng={tool.location}
                          markerProps={{ showExactLocation, isNomadic: tool.isNomadic }}
                        />
                      </Box>
                    )}
                  </Stack>
                </Stack>
              </Box>

              <ToolRatings toolId={tool.id.toString()} />
              {tool.isNomadic && <ToolHistory toolId={tool.id.toString()} />}
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={4} position='sticky' top='20px'>
              {user?.id === tool.userId && (
                <Box bg={bgColor} p={6} borderRadius='lg' boxShadow='sm' textAlign='center'>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box textAlign='center'>
                      <Text fontSize='sm' color='gray.600' mb={1}>
                        {t('tools.edit')}
                      </Text>
                      <EditToolButton toolId={tool.id} />
                    </Box>
                    <Box textAlign='center'>
                      <Text fontSize='sm' color='gray.600' mb={2}>
                        {t('tools.toggle_availability', { defaultValue: 'Toggle availability' })}
                      </Text>
                      <AvailabilityToggle tool={tool} />
                    </Box>
                  </SimpleGrid>
                </Box>
              )}
              <AvailabilityCalendar
                reservedDates={tool.reservedDates || []}
                isSelectable={tool.isAvailable && canBook.canBook}
              />
              <BookingFormWrapper tool={tool} canBook={canBook} />
            </Stack>
          </GridItem>
        </Grid>
      </Container>
    </FormProvider>
  )
}
