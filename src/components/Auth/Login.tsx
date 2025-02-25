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
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { ILoginParams } from '~components/Auth/queries'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { PasswordInput } from '~components/Layout/Form/PasswordInput'
import { ROUTES } from '~src/router/routes'
import { AUTH_FORM } from '~utils/constants'

export const Login = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()

  const {
    login: { mutateAsync, isError, error },
  } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginParams>()

  const onSubmit = async (data: ILoginParams) => {
    await mutateAsync(data)
      .then(() => navigate(ROUTES.HOME))
      .catch((error) => {
        toast({
          title: t('auth.login_error'),
          status: 'error',
          duration: 3000,
        })
        console.error('Login failed:', error)
      })
  }

  return (
    <Stack spacing={8}>
      <Stack align='center'>
        <Heading size='xl'>{t('auth.login')}</Heading>
        <Text color='gray.600'>
          {t('auth.no_account')}{' '}
          <Link as={RouterLink} to={ROUTES.AUTH.REGISTER} color='primary.500' fontWeight='medium'>
            {t('auth.register')}
          </Link>
        </Text>
      </Stack>

      <Box as='form' onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={6}>
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>{t('auth.email')}</FormLabel>
            <Input
              type='email'
              {...register('email', {
                required: t('validation.required'),
                pattern: {
                  value: AUTH_FORM.EMAIL_REGEX,
                  message: t('validation.email'),
                },
              })}
            />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>{t('auth.password')}</FormLabel>
            <PasswordInput
              {...register('password', {
                required: t('validation.required'),
                minLength: {
                  value: AUTH_FORM.MIN_PASSWORD_LENGTH,
                  message: t('validation.password_length'),
                },
              })}
            />
            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
          </FormControl>

          <FormSubmitMessage isError={isError} error={error} />

          <Button type='submit' size='lg' isLoading={isSubmitting} loadingText={t('common.loading')} w='100%'>
            {t('auth.login')}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}
