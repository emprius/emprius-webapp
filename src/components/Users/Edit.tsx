import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Image,
  Input,
  Stack,
  Switch,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { LocationPicker } from '~components/Layout/Map/LocationPicker'
import { PasswordInput } from '~components/Layout/Form/PasswordInput'
import { EditProfileFormData, UserProfile } from '~components/Users/types'
import { getB64FromFile } from '~src/utils'
import { AUTH_FORM } from '~utils/constants'
import { Avatar, AvatarProps, avatarSizeToPixels } from '../Images/Avatar'
import { useUpdateUserProfile } from './queries'
import { useNavigate } from 'react-router-dom'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { useAuth } from '~components/Auth/AuthContext'
import { INPUT_ACCEPTED_IMAGE_TYPES } from '~utils/images'
import { icons } from '~theme/icons'

export interface EditProfileFormProps {
  initialData: Pick<UserProfile, 'name' | 'location' | 'active' | 'avatarHash' | 'community'>
}

export const EditUser: React.FC<EditProfileFormProps> = ({ initialData }) => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const toast = useToast()
  const { mutateAsync, isError, error, isPending } = useUpdateUserProfile()
  const [newAvatar, setNewAvatar] = useState<File | ''>()
  const navigate = useNavigate()
  const onSuccess = () => navigate(-1)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
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
      delete updatedFields.actualPassword
      delete updatedFields.confirmPassword
    }

    // Include location if it was modified (location is handled separately through setValue)
    if (data.location !== initialData.location) {
      updatedFields.location = data.location
    }

    try {
      // Cast to EditProfileFormData since we know the API handles partial updates
      await mutateAsync(updatedFields as EditProfileFormData)
      toast({
        title: t('common.success'),
        description: t('user.profile_updated'),
        status: 'success',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.something_went_wrong'),
        status: 'error',
      })
    }
  }

  const newPassword = watch('password')

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align='stretch'>
        <Flex justifyContent='center' mb={4}>
          <VStack spacing={4}>
            <EditableAvatar avatarHash={initialData.avatarHash} onAvatarChange={(hash) => setNewAvatar(hash)} />
            <FormControl display='flex' flexDirection='column' alignItems='center' gap={3}>
              <FormLabel mb='0'>{watch('active') ? t('user.activate') : t('user.deactivate')}</FormLabel>
              <Switch size={'lg'} {...register('active')} />
            </FormControl>
          </VStack>
        </Flex>

        <FormControl>
          <FormLabel>{t('common.email')}</FormLabel>
          <Input disabled value={user?.email} />
        </FormControl>

        <FormControl isInvalid={!!errors.name}>
          <FormLabel>{t('common.name')}</FormLabel>
          <Input
            {...register('name', {
              required: t('common.required'),
            })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.actualPassword}>
          <FormLabel>{t('common.actual_password')}</FormLabel>
          <PasswordInput
            id='actualPassword'
            {...register('actualPassword', {
              required: newPassword ? t('common.required') : false,
            })}
          />
          <FormErrorMessage>{errors.actualPassword?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>{t('common.password')}</FormLabel>
          <PasswordInput
            id='password'
            {...register('password', {
              minLength: {
                value: AUTH_FORM.MIN_PASSWORD_LENGTH,
                message: t('auth.password_too_short'),
              },
            })}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel>{t('auth.confirm_password')}</FormLabel>
          <PasswordInput
            {...register('confirmPassword', {
              validate: (value) => !password || value === password || t('auth.passwords_do_not_match'),
            })}
          />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.community}>
          <FormLabel htmlFor='community'>{t('auth.community')}</FormLabel>
          <Input id='community' {...register('community')} />
          <FormErrorMessage>{errors.community && errors.community.message}</FormErrorMessage>
        </FormControl>

        <LocationPicker name='location' control={control} isRequired={true} />

        <FormSubmitMessage isError={isError} error={error} />

        <Stack direction='row' spacing={4} justify='flex-end'>
          <Button onClick={onSuccess} variant='ghost'>
            {t('common.cancel')}
          </Button>
          <Button type='submit' isLoading={isPending} loadingText={t('common.saving')}>
            {t('common.save')}
          </Button>
        </Stack>
      </VStack>
    </Box>
  )
}

interface EditableAvatarProps extends AvatarProps {
  onAvatarChange: (file: File | '') => void
}

const EditableAvatar: React.FC<EditableAvatarProps> = ({ avatarHash, username, size = '2xl', onAvatarChange }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { t } = useTranslation()
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // const file = filterBySupportedTypes(event.target.files)?.[0]
    const file = event.target.files[0]
    if (!file) return

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      onAvatarChange(file)
    } catch (error) {
      toast({
        title: t('user.error_uploading_image'),
        status: 'error',
        duration: 3000,
      })
    }
  }

  // Deactivated feature
  // const handleOnAvatarDelete = () => {
  //   setPreviewUrl(ASSETS.AVATAR_FALLBACK)
  //   onAvatarChange('')
  // }

  return (
    <Box position='relative' width={avatarSizeToPixels[size]} height={avatarSizeToPixels[size]}>
      {previewUrl ? (
        <Image src={previewUrl} alt='Avatar' borderRadius='full' boxSize={avatarSizeToPixels[size]} objectFit='cover' />
      ) : (
        <Avatar avatarHash={avatarHash} username={username} size={size} />
      )}
      <>
        <IconButton
          aria-label='Edit avatar'
          icon={<Icon as={icons.edit} />}
          position='absolute'
          bottom='0'
          right='0'
          rounded='full'
          size={size === '2xl' ? 'sm' : 'xs'}
          onClick={() => inputRef.current?.click()}
        />
        {/*Delete avatar is not yet API supported*/}
        {/*<IconButton*/}
        {/*  aria-label='Delete avatar'*/}
        {/*  icon={<DeleteIcon />}*/}
        {/*  position='absolute'*/}
        {/*  top='0'*/}
        {/*  right='0'*/}
        {/*  colorScheme='red'*/}
        {/*  rounded='full'*/}
        {/*  size={size === '2xl' ? 'sm' : 'xs'}*/}
        {/*  onClick={handleOnAvatarDelete}*/}
        {/*/>*/}
      </>
      <input
        type='file'
        accept={INPUT_ACCEPTED_IMAGE_TYPES}
        capture='environment'
        ref={inputRef}
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </Box>
  )
}
