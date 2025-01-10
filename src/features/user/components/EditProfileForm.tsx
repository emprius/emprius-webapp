import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Switch,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { LocationPicker } from '~src/components/shared/Form/LocationPicker'
import { AvatarUpload } from './AvatarUpload'
import { useUpdateUserProfile } from '../userQueries'
import { AUTH_FORM } from '~src/constants'
import { useUploadImage } from '~src/hooks/queries'
import { EditProfileFormData } from '~src/types'

interface EditProfileFormProps {
  initialData: {
    name: string
    email: string
    location?: { latitude: number; longitude: number }
    active: boolean
    avatar?: string
  }
  onSuccess?: () => void
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, onSuccess }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const updateProfile = useUpdateUserProfile()
  const [newAvatar, setNewAvatar] = useState<File>()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EditProfileFormData>({
    defaultValues: {
      ...initialData,
    },
  })
  const { mutateAsync: uploadImage, isPending: uploadImageIsPending } = useUploadImage()

  const password = watch('password')

  const onSubmit = async (data: EditProfileFormData) => {
    console.log('AAAA')
    let avatar = initialData.avatar
    if (newAvatar) {
      try {
        // Upload images first
        avatar = (await uploadImage(newAvatar)).hash
      } catch (error) {
        console.error('Failed to process images:', error)
        toast({
          title: 'Failed to upload images',
          status: 'error',
          duration: 5000,
        })
        return
      }
    }

    try {
      await updateProfile.mutateAsync({
        ...data,
        avatar,
      })
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

  const isLoading = updateProfile.isPending || uploadImageIsPending
  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align='stretch'>
        <Box display='flex' justifyContent='center' mb={4}>
          <AvatarUpload currentAvatar={initialData.avatar} onAvatarChange={(hash) => setNewAvatar(hash)} />
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

        <Button type='submit' colorScheme='blue' isLoading={isLoading} loadingText={t('common.saving')}>
          {t('common.save')}
        </Button>
      </VStack>
    </Box>
  )
}
