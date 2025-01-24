import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useInfoContext } from '~components/Auth/InfoContext'
import { Image, ServerImage } from '~components/Images/ServerImage'
import { ImageUploader } from '~components/Layout/Form/ImageUploader'
import { LocationPicker } from '~components/Layout/Form/LocationPicker'
import FormSubmitMessage from '~components/Layout/FormSubmitMessage'
import { Tool } from './types'
import { EmpriusLocation } from '~components/Layout/types'

export interface ToolFormData {
  title: string
  description: string
  mayBeFree: boolean
  askWithFee: boolean
  cost: number
  transportOptions: number[]
  category?: number
  estimatedValue: number
  height: number
  weight: number
  images: FileList | any[]
  location?: EmpriusLocation
  isAvailable: boolean
}

interface ToolFormProps {
  initialData?: Partial<Tool>
  onSubmit: (data: ToolFormData) => Promise<void>
  submitButtonText: string
  isLoading?: boolean
  isError?: boolean
  error?: any
  existingImages?: Image[]
  onDeleteExistingImage?: (index: number) => void
}

export const ToolForm: React.FC<ToolFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText,
  isLoading,
  isError,
  error,
  existingImages = [],
  onDeleteExistingImage,
}) => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const { categories, transports } = useInfoContext()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ToolFormData>({
    defaultValues: {
      ...initialData,
      transportOptions: initialData?.transportOptions?.map((value) => value.id) || [],
      isAvailable: initialData?.isAvailable || true,
    },
  })

  const handleFormSubmit = async (data: ToolFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.something_went_wrong'),
        status: 'error',
      })
      throw error
    }
  }

  return (
    <Stack as='form' onSubmit={handleSubmit(handleFormSubmit)} spacing={6}>
      <Stack direction={{ base: 'column-reverse', sm: 'row' }} justify={'space-between'}>
        <FormControl isRequired isInvalid={!!errors.title}>
          <FormLabel>{t('tools.name')}</FormLabel>
          <Input {...register('title', { required: true })} />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          pt={{ base: 0, sm: 6 }}
          pb={{ base: 6, sm: 0 }}
          display='flex'
          alignItems='center'
          justifyContent={{ base: 'start', sm: 'end' }}
        >
          <FormLabel mb='0'>{t('tools.is_available')}</FormLabel>
          <Switch {...register('isAvailable')} />
        </FormControl>
      </Stack>

      <FormControl isRequired isInvalid={!!errors.description}>
        <FormLabel>{t('tools.description')}</FormLabel>
        <Textarea {...register('description', { required: true })} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <Checkbox {...register('mayBeFree')}>{t('tools.may_be_free', { defaultValue: 'May Be Free' })}</Checkbox>
      </FormControl>

      <FormControl>
        <Checkbox {...register('askWithFee')}>{t('tools.ask_with_fee', { defaultValue: 'Ask With Fee' })}</Checkbox>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.cost}>
        <FormLabel>{t('tools.cost_per_day', { defaultValue: 'Cost per day' })}</FormLabel>
        <NumberInput min={0}>
          <NumberInputField {...register('cost', { required: true, min: 0, valueAsNumber: true })} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors.cost?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.category}>
        <FormLabel>{t('tools.category')}</FormLabel>
        <Select
          name='category'
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          value={
            watch('category')
              ? {
                  value: watch('category'),
                  label: categories.find((c) => c.id === watch('category'))?.name || '',
                }
              : null
          }
          onChange={(newValue: any) => {
            setValue('category', newValue?.value, { shouldValidate: true })
          }}
          placeholder={t('tools.select_category', { defaultValue: 'Select category' })}
        />
        <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.transportOptions}>
        <FormLabel>{t('tools.transport_options', { defaultValue: 'Transport Options' })}</FormLabel>
        <Select
          isMulti
          name='transportOptions'
          options={transports.map((transport) => ({
            value: transport.id,
            label: transport.name,
          }))}
          value={watch('transportOptions')?.map((id) => ({
            value: id,
            label: transports.find((t) => t.id === id)?.name || '',
          }))}
          onChange={(newValue) => {
            setValue(
              'transportOptions',
              newValue.map((option: any) => option.value),
              { shouldValidate: true }
            )
          }}
          placeholder={t('tools.select_transport', { defaultValue: 'Select transport options' })}
          closeMenuOnSelect={false}
          chakraStyles={{
            container: (provided) => ({
              ...provided,
              width: '100%',
            }),
          }}
        />
        <FormErrorMessage>{errors.transportOptions?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.estimatedValue}>
        <FormLabel>{t('tools.estimated_value', { defaultValue: 'Estimated Value' })}</FormLabel>
        <NumberInput min={0}>
          <NumberInputField {...register('estimatedValue', { required: true, valueAsNumber: true })} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors.estimatedValue?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.height}>
        <FormLabel>{t('tools.height', { defaultValue: 'Height (cm)' })}</FormLabel>
        <NumberInput min={0}>
          <NumberInputField {...register('height', { required: true, valueAsNumber: true })} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors.height?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.weight}>
        <FormLabel>{t('tools.weight', { defaultValue: 'Weight (kg)' })}</FormLabel>
        <NumberInput min={0}>
          <NumberInputField {...register('weight', { required: true, valueAsNumber: true })} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>{errors.weight?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Location</FormLabel>
        <LocationPicker onChange={(location) => setValue('location', location)} value={watch('location')} />
        <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
      </FormControl>

      {existingImages.length > 0 && (
        <Box mb={6}>
          <Text mb={2} fontWeight='medium'>
            {t('tools.existing_images')}
          </Text>
          <SimpleGrid columns={[2, 3, 4]} spacing={4}>
            {existingImages.map((image, index) => (
              <Box key={image.hash} position='relative'>
                <ServerImage imageId={image.hash} objectFit='cover' w='100%' h='100px' borderRadius='md' />
                {onDeleteExistingImage && (
                  <IconButton
                    aria-label='Delete image'
                    icon={<CloseIcon />}
                    size='sm'
                    position='absolute'
                    top={1}
                    right={1}
                    onClick={() => onDeleteExistingImage(index)}
                    colorScheme='red'
                    variant='solid'
                  />
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}

      <ImageUploader label={t('tools.images')} error={errors.images?.message} {...register('images')} />

      <Stack direction='row' spacing={4} justify='flex-end'>
        <Button onClick={() => navigate(-1)} variant='ghost'>
          {t('common.cancel')}
        </Button>
        <Button type='submit' colorScheme='primary' isLoading={isLoading}>
          {submitButtonText}
        </Button>
      </Stack>

      <FormSubmitMessage isError={isError} error={error} />
    </Stack>
  )
}
