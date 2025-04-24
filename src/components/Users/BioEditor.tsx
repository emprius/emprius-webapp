import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Icon,
  IconButton,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUpdateUserProfile } from './queries'
import { UserProfile } from './types'
import { lighterText } from '~theme/common'
import { icons } from '~theme/icons'

interface BioEditorProps {
  user: UserProfile
  isCurrentUser: boolean
}

export const BioEditor: React.FC<BioEditorProps> = ({ user, isCurrentUser }) => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(user.bio || '')
  const toast = useToast()

  const { mutateAsync, isPending, error, isError } = useUpdateUserProfile()

  const bgColor = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Handle saving the bio
  const handleSave = async () => {
    if (bio.length > 500) {
      throw new Error(t('user.bio_is_too_long', { defaultValue: 'Bio is too long' }))
    }

    try {
      await mutateAsync({
        bio,
      })
      setIsEditing(false)
      toast({
        title: t('common.success'),
        description: t('user.bio_updated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: t('common.error'),
        description: t('user.update_failed'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Handle canceling the edit
  const handleCancel = () => {
    setBio(user.bio || '')
    setIsEditing(false)
  }

  // Don't render anything if there's no bio and user can't edit
  if (!user.bio && !isCurrentUser) {
    return null
  }

  if (isEditing) {
    return (
      <Box>
        <FormControl isInvalid={!!error}>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t('user.bio_placeholder')}
            resize='vertical'
            minH='100px'
            bg={bgColor}
            borderColor={borderColor}
            mb={2}
            maxLength={500}
          />
          <FormHelperText mb={2}>
            {bio.length}/500 {t('common.characters')}
          </FormHelperText>
          {error && <FormErrorMessage mb={2}>{error.toString()}</FormErrorMessage>}
          <Flex justify='flex-end' gap={2}>
            <Button size='sm' onClick={handleCancel} isDisabled={isPending}>
              {t('common.cancel')}
            </Button>
            <Button size='sm' colorScheme='blue' onClick={handleSave} isLoading={isPending}>
              {t('common.save')}
            </Button>
          </Flex>
        </FormControl>
      </Box>
    )
  }

  return (
    <HStack>
      {user.bio && (
        <Text fontStyle='italic' sx={lighterText}>
          {user.bio}
        </Text>
      )}
      {!user.bio && isCurrentUser && (
        <Text fontStyle='italic' sx={lighterText}>
          {t('user.add_your_bio', { defaultValue: 'How are you feeling today?' })}
        </Text>
      )}
      {isCurrentUser && (
        <IconButton
          aria-label={t('common.edit')}
          icon={<Icon as={icons.edit} />}
          size='sm'
          variant='ghost'
          onClick={() => setIsEditing(true)}
        />
      )}
    </HStack>
  )
}
