import React from 'react'
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
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRegister } from '../../hooks/queries'
import { useAuth } from './context/AuthContext'
import { RegisterForm } from '../../types'
import api from '../../services/api'
import { AUTH_FORM } from '~constants'

export const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const { login } = useAuth()
  const register = useRegister()

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    mode: 'onChange',
  })

  const password = watch('password')

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const registerResponse = await register.mutateAsync(data)
      const { accessToken } = registerResponse.data.data

      // Get user profile after successful registration
      const userResponse = await api.auth.getCurrentUser()
      const { data: userData } = userResponse.data

      login(accessToken, userData)
      toast({
        title: t('auth.registerSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Registration failed:', error)
      toast({
        title: t('auth.registerError'),
        description: t('auth.tryAgain'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Stack spacing={8}>
      <Stack align='center'>
        <Heading size='xl'>{t('auth.register')}</Heading>
        <Text color='gray.600'>
          {t('auth.haveAccount')}{' '}
          <Link as={RouterLink} to='/login' color='primary.500' fontWeight='medium'>
            {t('auth.login')}
          </Link>
        </Text>
      </Stack>

      <Box as='form' onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={6}>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel htmlFor='name'>{t('auth.name')}</FormLabel>
            <Input
              id='name'
              {...registerField('name', {
                required: t('validation.required'),
                minLength: {
                  value: 2,
                  message: t('validation.nameLength'),
                },
                pattern: {
                  value: /^[a-zA-Z\s]*$/,
                  message: t('validation.namePattern'),
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
                // todo(konv1): uncomment this line
                // pattern: {
                //   value: AUTH_FORM.PASSWORD_REGEX,
                //   message: t('validation.passwordPattern'),
                // }
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
        </Stack>
      </Box>
    </Stack>
  )
}
