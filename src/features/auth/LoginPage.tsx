import { Box, Button, FormControl, FormLabel, Heading, Input, Link, Stack, Text, useToast } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import FormSubmitMessage from '~components/Layout/FormSubmitMessage'
import { AUTH_FORM } from '~constants'
import { ILoginParams } from '~src/features/auth/context/authQueries'
import { useAuth } from './context/AuthContext'

export const LoginPage = () => {
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
      // todo(konv1): use route constants
      .then(() => navigate('/'))
      .catch((error) => {
        toast({
          title: t('auth.loginError'),
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
          {t('auth.noAccount')}{' '}
          <Link as={RouterLink} to='/register' color='primary.500' fontWeight='medium'>
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
                required: true,
                pattern: {
                  value: AUTH_FORM.EMAIL_REGEX,
                  message: t('validation.email'),
                },
              })}
            />
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>{t('auth.password')}</FormLabel>
            <Input
              type='password'
              {...register('password', {
                required: true,
                minLength: {
                  value: AUTH_FORM.MIN_PASSWORD_LENGTH,
                  message: t('validation.passwordLength'),
                },
              })}
            />
          </FormControl>

          <Button type='submit' size='lg' isLoading={isSubmitting} loadingText={t('common.loading')}>
            {t('auth.login')}
          </Button>
          <FormSubmitMessage isError={isError} error={error} />
        </Stack>
      </Box>
    </Stack>
  )
}
