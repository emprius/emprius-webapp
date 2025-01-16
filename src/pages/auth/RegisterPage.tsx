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
import { IRegisterParams } from '~components/Auth/authQueries'
import { LocationPicker } from '~components/Layout/Form/LocationPicker'
import FormSubmitMessage from '~components/Layout/FormSubmitMessage'
import { ROUTES } from '~src/router/router'
import { AUTH_FORM } from '~utils/constants'

interface RegisterFormData extends IRegisterParams {
  confirmPassword: string
}

export const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const {
    register: { mutateAsync, error, isError },
  } = useAuth()

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
  })

  const password = watch('password')

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...registerData } = data
    await mutateAsync(registerData)
      // todo(konv1): use route constants
      .then(() => navigate(ROUTES.HOME))
      .catch((error) => {
        console.error('Registration failed:', error)
        toast({
          title: t('auth.registerError'),
          description: t('auth.tryAgain'),
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
          {t('auth.haveAccount')}{' '}
          <Link as={RouterLink} to={ROUTES.AUTH.LOGIN} color='primary.500' fontWeight='medium'>
            {t('auth.login')}
          </Link>
        </Text>
      </Stack>

      <Box as='form' onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={6}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor='name'>{t('auth.name')}</FormLabel>
            <Input
              id='name'
              {...registerField('name', {
                required: t('validation.required'),
                minLength: {
                  value: 2,
                  message: t('validation.nameLength'),
                },
                // todo(konv1): pattern?
                // pattern: {
                //   value: /^[a-zA-Z\s]*$/,
                //   message: t('validation.namePattern'),
                // },
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
                required: t('validation.required'),
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
            <Input
              id='password'
              type='password'
              {...registerField('password', {
                required: t('validation.required'),
                minLength: {
                  value: AUTH_FORM.MIN_PASSWORD_LENGTH,
                  message: t('validation.passwordLength'),
                },
              })}
            />
            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormLabel htmlFor='confirmPassword'>{t('auth.confirmPassword')}</FormLabel>
            <Input
              id='confirmPassword'
              type='password'
              {...registerField('confirmPassword', {
                required: t('validation.required'),
                validate: (value) => value === password || t('validation.passwordMatch'),
              })}
            />
            <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.invitationToken}>
            <FormLabel htmlFor='invitationToken'>{t('auth.invitationToken')}</FormLabel>
            <Input
              id='invitationToken'
              {...registerField('invitationToken', {
                required: t('validation.required'),
              })}
            />
            <FormErrorMessage>{errors.invitationToken && errors.invitationToken.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.community}>
            <FormLabel htmlFor='community'>{t('auth.community')}</FormLabel>
            <Input id='community' {...registerField('community')} />
            <FormErrorMessage>{errors.community && errors.community.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.location}>
            <FormLabel>Location</FormLabel>
            <LocationPicker
              onChange={(location) => {
                const event = {
                  target: {
                    name: 'location',
                    value: location,
                  },
                }
                registerField('location').onChange(event)
              }}
              value={watch('location')}
            />
            <FormErrorMessage>{errors.location && errors.location.message}</FormErrorMessage>
          </FormControl>

          <Button
            type='submit'
            size='lg'
            isLoading={isSubmitting}
            loadingText={t('common.loading')}
            colorScheme='primary'
            w='100%'
          >
            {t('auth.register')}
          </Button>
          <FormSubmitMessage isError={isError} error={error} />
        </Stack>
      </Box>
    </Stack>
  )
}
