import React, { useMemo } from 'react'
import { Box, Button, Divider, Flex, Heading, HStack, Switch, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { NotificationPreferences, NotificationPreferenceType } from '~components/Users/types'
import { useNotificationPreferences } from '~components/Users/queries'
import { useForm } from 'react-hook-form'
import { UseFormRegister } from 'react-hook-form/dist/types/form'

const NotificationSettings = ({ notificationPreferences }: { notificationPreferences?: NotificationPreferences }) => {
  const { t } = useTranslation()
  const { mutateAsync, isPending } = useNotificationPreferences()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { handleSubmit, register } = useForm<NotificationPreferences>({
    defaultValues: { ...notificationPreferences },
  })

  const [chatPreferences, restPreferences] = useMemo(() => {
    const msgsKeys = [
      'community_messages',
      'daily_message_digest',
      'general_forum_messages',
      'private_messages',
    ] as const
    return [
      Object.fromEntries(
        Object.entries(notificationPreferences).filter(([k]) => msgsKeys.includes(k as (typeof msgsKeys)[number]))
      ),
      Object.fromEntries(
        Object.entries(notificationPreferences).filter(([k]) => !msgsKeys.includes(k as (typeof msgsKeys)[number]))
      ),
    ]
  }, [])

  const onSubmit = async (values: NotificationPreferences) => {
    try {
      console.log('Submitting notification preferences:', values)
      await mutateAsync(values)
    } catch (err) {
      console.error('Failed to update notification preferences:', err)
    }
  }

  return (
    <Box id='notifications' p={6} bg={bgColor} borderRadius='lg' borderWidth={1} borderColor={borderColor} w={'full'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Heading size='md' mb={4}>
          {t('profile.notifications.notification_preferences', { defaultValue: 'Notification Preferences' })}
        </Heading>
        <Text color='lightText' mb={4}>
          {t('profile.notifications.notification_preferences_desc', {
            defaultValue: 'Activate or deactivate email notifications for various events.',
          })}
        </Text>
        <Box px={6} py={4}>
          {Object.keys(restPreferences).map((key) => (
            <NotificationItem key={key} notificationKey={key as NotificationPreferenceType} register={register} />
          ))}
        </Box>
        <Heading size='sm' mb={4}>
          {t('profile.notifications.notification_preferences_chat', { defaultValue: 'Chat Notification Preferences' })}
        </Heading>
        <Text color='lightText' mb={4}>
          {t('profile.notifications.notification_preferences_chat_desc', {
            defaultValue: 'Specific notification preferences for chats.',
          })}
        </Text>
        <Box px={6} py={4}>
          {Object.keys(chatPreferences).map((key) => (
            <NotificationItem key={key} notificationKey={key as NotificationPreferenceType} register={register} />
          ))}
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

const NotificationItem = ({
  notificationKey,
  register,
}: {
  notificationKey: NotificationPreferenceType
  register: UseFormRegister<NotificationPreferences>
}) => {
  const { t } = useTranslation()
  let title: NotificationPreferenceType | string = notificationKey
  let desc = ''
  switch (notificationKey) {
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
      break
    case 'tool_holder_changed':
      title = t('profile.notifications.tool_holder_changed', { defaultValue: 'Nomadic tools changes' })
      desc = t('profile.notifications.tool_holder_changed_desc', {
        defaultValue: 'Changes on the nomadic tools bookings, for example, when a tool holder changes',
      })
      break
    case 'community_messages':
      title = t('profile.notifications.community_messages', { defaultValue: 'Community messages' })
      desc = t('profile.notifications.community_messages_desc', {
        defaultValue: 'Get a notification when you have unread messages on community chats',
      })
      break
    case 'daily_message_digest':
      title = t('profile.notifications.daily_message_digest', { defaultValue: 'Daily message digest' })
      desc = t('profile.notifications.daily_message_digest_desc', {
        defaultValue: 'A digest for all messages of all chats',
      })
      break
    case 'general_forum_messages':
      title = t('profile.notifications.general_forum_messages', { defaultValue: 'General chat' })
      desc = t('profile.notifications.general_forum_messages_desc', {
        defaultValue: 'Get a notification when you have unread messages for the general chat',
      })
      break
    case 'private_messages':
      title = t('profile.notifications.private_messages', { defaultValue: 'Private messages' })
      desc = t('profile.notifications.private_messages_desc', {
        defaultValue: 'Get a notification when you have unread messages on private chats',
      })
      break
  }

  return (
    <Box>
      <HStack justifyContent='space-between' my={2}>
        <Flex direction={'column'}>
          <Text as={'b'}>{title}</Text>
          <Text fontSize='sm' color='lighterText'>
            {desc}
          </Text>
        </Flex>
        {/* @ts-ignore */}
        <Switch {...register(notificationKey)} />
      </HStack>
      <Divider />
    </Box>
  )
}

export default NotificationSettings
