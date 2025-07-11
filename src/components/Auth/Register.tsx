import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { IRegisterParams } from '~components/Auth/queries'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { LocationPicker } from '~components/Layout/Map/LocationPicker'
import { PasswordInput, usePasswordFieldValidator } from '~components/Layout/Form/PasswordInput'
import { ROUTES } from '~src/router/routes'
import { AUTH_FORM } from '~utils/constants'
import { LatLng } from 'leaflet'

export type RegisterFormData = {
  confirmPassword: string
  location: LatLng
} & Omit<IRegisterParams, 'location'>

interface RegisterProps {
  defaultInvitationToken?: string
}

export const Register = ({ defaultInvitationToken = '' }: RegisterProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const {
    register: { mutateAsync, error, isError },
  } = useAuth()

  const {
    control,
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    defaultValues: {
      invitationToken: defaultInvitationToken,
    },
  })
  const passwordValidation = usePasswordFieldValidator<RegisterFormData, 'password'>()

  const password = watch('password')

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    await mutateAsync(data)
      .then(() => navigate(ROUTES.HOME))
      .catch((error) => {
        console.error('Registration failed:', error)
        toast({
          title: t('auth.register_error'),
          description: t('auth.try_again'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      })
  }

  return (
    <Stack spacing={8}>
      <Stack align='center'>
        <Heading size='xl'>{t('auth.register')}</Heading>
        <Text color='gray.600'>
          {t('auth.have_account')}{' '}
          <Link as={RouterLink} to={ROUTES.AUTH.LOGIN} color='primary.500' fontWeight='medium'>
            {t('auth.login')}
          </Link>
        </Text>
      </Stack>

      <Box as='form' onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={6}>
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel htmlFor='name'>{t('auth.name')}</FormLabel>
            <Input
              id='name'
              {...registerField('name', {
                required: t('validation.required', { field: 'Name' }),
                minLength: {
                  value: 2,
                  message: t('validation.name_length'),
                },
              })}
            />
            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel htmlFor='email'>{t('auth.email')}</FormLabel>
            <Input
              id='email'
              type='email'
              {...registerField('email', {
                required: t('validation.required', { field: 'Email' }),
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: t('validation.email'),
                },
              })}
            />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel htmlFor='password'>{t('auth.password')}</FormLabel>
            <PasswordInput
              id='password'
              {...registerField('password', {
                required: t('validation.required', { field: 'Password' }),
                ...passwordValidation,
              })}
            />
            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormLabel htmlFor='confirmPassword'>{t('auth.confirm_password')}</FormLabel>
            <PasswordInput
              id='confirmPassword'
              {...registerField('confirmPassword', {
                validate: (value) => value === password || t('validation.password_match'),
              })}
            />
            <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.invitationToken}>
            <FormLabel htmlFor='invitationToken'>{t('auth.invitation_token')}</FormLabel>
            <Input
              id='invitationToken'
              {...registerField('invitationToken', {
                required: t('validation.required', { field: 'Token' }),
              })}
            />
            <FormErrorMessage>{errors.invitationToken && errors.invitationToken.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.community}>
            <FormLabel htmlFor='community'>{t('auth.community')}</FormLabel>
            <Input id='community' {...registerField('community')} />
            <FormErrorMessage>{errors.community && errors.community.message}</FormErrorMessage>
          </FormControl>

          <LocationPicker name='location' control={control} isRequired={true} />

          <FormSubmitMessage isError={isError} error={error} />

          <Button type='submit' size='lg' isLoading={isSubmitting} loadingText={t('common.loading')} w='100%'>
            {t('auth.register')}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}
