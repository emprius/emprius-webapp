import React from 'react'
import { Box, Button, Divider, Flex, Heading, HStack, Switch, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { NotificationPreferences, NotificationPreferenceType } from '~components/Users/types'
import { useNotificationPreferences } from '~components/Users/queries'
import { useForm } from 'react-hook-form'

const NotificationSettings = ({ notificationPreferences }: { notificationPreferences?: NotificationPreferences }) => {
  const { t } = useTranslation()
  const { mutateAsync, isError, error, isPending } = useNotificationPreferences()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { control, handleSubmit, watch, reset, register } = useForm<NotificationPreferences>({
    defaultValues: { ...notificationPreferences },
  })

  const onSubmit = async (values: NotificationPreferences) => {
    try {
      console.log('Submitting notification preferences:', values)
      await mutateAsync(values)
    } catch (err) {
      console.error('Failed to update notification preferences:', err)
    }
  }

  return (
    <Box p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} w={'full'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Heading size='md' mb={4}>
          {t('profile.notifications.notification_preferences', { defaultValue: 'Notification Preferences' })}
        </Heading>
        <Text color='lightText' mb={4}>
          {t('profile..notifications.notification_preferences_desc', {
            defaultValue: 'Activate or deactivate email notifications for various events.',
          })}
        </Text>
        <Box px={6} py={4}>
          {Object.keys(notificationPreferences).map((key) => {
            const _key = key as NotificationPreferenceType
            let title = key
            let desc = ''
            switch (_key) {
              case 'booking_accepted':
                title = t('profile.notifications.booking_accepted', { defaultValue: 'Outgoing requests accepted' })
                desc = t('profile.notifications.booking_accepted_desc', {
                  defaultValue: 'A tool you requested to other user is accepted',
                })
                break
              case 'incoming_requests':
                title = t('profile.notifications.incoming_requests', { defaultValue: 'New incoming request' })
                desc = t('profile.notifications.incoming_requests_desc', {
                  defaultValue: 'Some user requested a tool you own or a nomadic tool on your guard',
                })
            }

            return (
              <Box key={key}>
                <HStack key={key} justifyContent='space-between' my={2}>
                  <Flex direction={'column'}>
                    <Text as={'b'}>{title}</Text>
                    <Text fontSize='sm' color='lighterText'>
                      {desc}
                    </Text>
                  </Flex>
                  {/* @ts-ignore */}
                  <Switch {...register(key)} />
                </HStack>
                <Divider />
              </Box>
            )
          })}
        </Box>
        <VStack align={'end'} mt={4}>
          <Button type={'submit'} isLoading={isPending}>
            {t('common.save')}
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default NotificationSettings
