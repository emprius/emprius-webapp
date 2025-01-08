import React from 'react'
import { Box, Button, FormControl, FormLabel, Heading, Input, Link, Stack, Text, useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLogin } from '../../hooks/queries'
import { useAuth } from './context/AuthContext'
import type { LoginForm } from '../../types'
import { AUTH_FORM } from '~constants'

export const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const { login: authLogin } = useAuth()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login.mutateAsync(data)
      authLogin(response.data.data.accessToken, response.data.data)
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Login failed:', error)
      toast({
        title: t('auth.loginError'),
        status: 'error',
        duration: 3000,
      })
    }
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
        </Stack>
      </Box>
    </Stack>
  )
}
