import React, { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Input,
  IconButton,
  VStack,
  Text,
  useToast,
  Heading,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { icons } from '~theme/icons'
import { AdditionalContacts } from '~components/Users/types'
import { CopyButton } from '~components/Layout/CopyButton'
import { useUpdateUserProfile } from '~components/Users/queries'

export const AdditionalContactMethods = ({
  additionalContacts,
  isCurrentUser,
}: {
  additionalContacts: AdditionalContacts
  isCurrentUser: boolean
}) => {
  const { t } = useTranslation()
  const [contacts, setContacts] = useState<AdditionalContacts>(additionalContacts || {})
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(new Set())
  const toast = useToast()
  const { mutateAsync, isPending } = useUpdateUserProfile()

  const handleAdd = async () => {
    if (!newKey.trim()) return
    if (contacts[newKey]) {
      toast({
        title: t('profile.duplicated_additional_contact_methods', { defaultValue: 'Duplicated contact method' }),
        description: t('profile.duplicated_additional_contact_methods_msg', {
          defaultValue: 'A contact with that name already exists.',
        }),
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }
    try {
      const newVal = { ...contacts, [newKey]: newValue }
      // setContacts(newVal)
      await mutateAsync({ additionalContacts: newVal })
      setNewKey('')
      setNewValue('')
    } catch (err) {
      // setContacts(additionalContacts || {})
      toast({
        title: t('common.error'),
        description: err.message || t('common.something_went_wrong', { defaultValue: 'Something went wrong' }),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      console.error(err)
    }
  }

  const handleDelete = async (key: string) => {
    setDeletingKeys((prev) => new Set(prev).add(key))

    try {
      const { [key]: _, ...rest } = contacts
      // Optimistic update
      setContacts(rest)
      await mutateAsync({ additionalContacts: rest })
    } catch (err) {
      // Revert optimistic update on error
      setContacts(additionalContacts || {})
      toast({
        title: t('common.error'),
        description: err.message || t('common.something_went_wrong', { defaultValue: 'Something went wrong' }),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      console.error(err)
    } finally {
      setDeletingKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }
  }

  // Update contacts when changed on the query
  useEffect(() => {
    setContacts(additionalContacts || {})
  }, [additionalContacts])

  return (
    <Box p={5}>
      <Heading size='md' mb={4}>
        {t('profile.additional_contact_methods', { defaultValue: 'Additional Contact Methods' })}
      </Heading>

      <Text color='lightText' mb={4}>
        {t('profile.additional_contact_methods_desc', {
          defaultValue:
            'Additional contact methods are added to your profile to help other users reach you if you are involved on ' +
            'an accepted booking. You can add any contact method you want, like Telegram, Signal, etc.',
        })}
      </Text>
      <VStack spacing={3} align='stretch'>
        {Object.entries(contacts).map(([key, value]) => (
          <ContactMethodItem
            key={key}
            contactKey={key}
            contactValue={value}
            onDelete={handleDelete}
            isCurrentUser={isCurrentUser}
            isDeleting={deletingKeys.has(key)}
          />
        ))}
        {isCurrentUser && (
          <Flex gap={2}>
            <Input
              flex={1}
              placeholder={t('profile.additional_contact_method_title', { defaultValue: 'Method name' })}
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Input
              flex={{ base: 1, md: 2 }}
              placeholder={t('profile.additional_contact_method_data', { defaultValue: 'Contact information' })}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <IconButton
              aria-label='Delete'
              icon={icons.add({})}
              onClick={handleAdd}
              variant={'outline'}
              isLoading={isPending}
            />
          </Flex>
        )}
      </VStack>
    </Box>
  )
}

interface ContactMethodItemProps {
  contactKey: string
  contactValue: string
  onDelete: (key: string) => void
  isCurrentUser: boolean
  isDeleting: boolean
}

const ContactMethodItem = ({
  contactKey,
  contactValue,
  onDelete,
  isCurrentUser,
  isDeleting,
}: ContactMethodItemProps) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600')

  return (
    <Box
      px={4}
      py={1}
      bg={bgColor}
      borderRadius='md'
      borderWidth={1}
      borderColor={borderColor}
      transition='all 0.2s ease'
      _hover={{
        bg: hoverBgColor,
        shadow: 'sm',
      }}
    >
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'stretch', sm: 'center' }}
        justify='space-between'
        gap={3}
      >
        {/* Content Area */}
        <HStack align='stretch' flex={1} spacing={1} wrap={'wrap'}>
          <Text fontWeight='semibold' fontSize='md' color='primary.600' textTransform='capitalize'>
            {contactKey}
          </Text>
          <Text fontSize='md' wordBreak='break-all' color={useColorModeValue('gray.800', 'gray.100')}>
            {contactValue}
          </Text>
        </HStack>

        {/* Action Buttons */}
        <HStack spacing={2} flexShrink={0} alignSelf={'end'}>
          <CopyButton
            text={contactValue}
            aria-label={t('profile.copy_contact_method', {
              defaultValue: 'Copy contact method',
            })}
            colorScheme='blue'
            variant='ghost'
          />
          {isCurrentUser && (
            <IconButton
              aria-label={t('profile.delete_contact_method', {
                defaultValue: 'Delete contact method',
              })}
              icon={icons.delete({})}
              colorScheme='red'
              variant='ghost'
              onClick={() => onDelete(contactKey)}
              isLoading={isDeleting}
              _hover={{
                bg: 'red.100',
                color: 'red.600',
              }}
            />
          )}
        </HStack>
      </Flex>
    </Box>
  )
}
