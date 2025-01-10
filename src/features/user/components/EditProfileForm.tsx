import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Switch,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { LocationPicker } from '~src/components/shared/Form/LocationPicker'
import { Avatar } from './Avatar'
import { useUpdateUserProfile } from '../userQueries'
import { AUTH_FORM } from '~src/constants'
import { EditProfileFormData, EditProfileFormProps } from '~src/types'
import { getB64FromFile } from '~src/utils'

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, onSuccess }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const updateProfile = useUpdateUserProfile()
  const [newAvatar, setNewAvatar] = useState<File | ''>()

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
    setValue,
  } = useForm<EditProfileFormData>({
    defaultValues: {
      ...initialData,
    },
  })

  const password = watch('password')

  const onSubmit = async (data: EditProfileFormData) => {
    // Create an object with only the modified fields
    const updatedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      const fieldKey = key as keyof EditProfileFormData
      return {
        ...acc,
        [fieldKey]: data[fieldKey],
      }
    }, {} as Partial<EditProfileFormData>)

    try {
      // Always include avatar if it was changed
      if (newAvatar !== undefined) {
        updatedFields.avatar = newAvatar === '' ? '' : await getB64FromFile(newAvatar)
      }
    } catch (error) {
      console.error('Failed to process images:', error)
      toast({
        title: 'Failed to get image',
        status: 'error',
        duration: 5000,
      })
      throw new Error('Failed to process images:', error)
    }

    // Only include password fields if password was modified
    if (!dirtyFields.password) {
      delete updatedFields.password
      delete updatedFields.confirmPassword
    }

    // Include location if it was modified (location is handled separately through setValue)
    if (data.location !== initialData.location) {
      updatedFields.location = data.location
    }

    try {
      // Cast to EditProfileFormData since we know the API handles partial updates
      await updateProfile.mutateAsync(updatedFields as EditProfileFormData)
      toast({
        title: t('common.success'),
        description: t('user.profileUpdated'),
        status: 'success',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.somethingWentWrong'),
        status: 'error',
      })
    }
  }

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align='stretch'>
        <Box display='flex' justifyContent='center' mb={4}>
          <Avatar currentAvatar={initialData.avatarHash} onAvatarChange={(hash) => setNewAvatar(hash)} showControls />
        </Box>

        <FormControl isInvalid={!!errors.name}>
          <FormLabel>{t('common.name')}</FormLabel>
          <Input
            {...register('name', {
              required: t('common.required'),
            })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>{t('common.email')}</FormLabel>
          <Input
            {...register('email', {
              required: t('common.required'),
              pattern: {
                value: AUTH_FORM.EMAIL_REGEX,
                message: t('auth.invalidEmail'),
              },
            })}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>{t('common.password')}</FormLabel>
          <Input
            type='password'
            {...register('password', {
              pattern: {
                value: AUTH_FORM.PASSWORD_REGEX,
                message: t('auth.passwordRequirements'),
              },
              minLength: {
                value: AUTH_FORM.MIN_PASSWORD_LENGTH,
                message: t('auth.passwordTooShort'),
              },
            })}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel>{t('auth.confirmPassword')}</FormLabel>
          <Input
            type='password'
            {...register('confirmPassword', {
              validate: (value) => !password || value === password || t('auth.passwordsDoNotMatch'),
            })}
          />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>

        <LocationPicker
          value={watch('location')}
          onChange={(location) => setValue('location', location)}
          error={errors.location?.message}
        />

        <FormControl display='flex' alignItems='center'>
          <FormLabel mb='0'>{t('user.activeProfile')}</FormLabel>
          <Switch {...register('active')} />
        </FormControl>

        <Stack direction="row" spacing={4} justify="flex-end">
          <Button onClick={onSuccess} variant="ghost">
            {t('common.cancel')}
          </Button>
          <Button type='submit' colorScheme='blue' isLoading={updateProfile.isPending} loadingText={t('common.saving')}>
            {t('common.save')}
          </Button>
        </Stack>
      </VStack>
    </Box>
  )
}
