import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ImageUploader } from '~components/Layout/Form/ImageUploader'
import { LocationPicker } from '~components/Layout/Form/LocationPicker'
import FormSubmitMessage from '~components/Layout/FormSubmitMessage'
import { Tool } from '~src/types'
import { TOOL_CATEGORIES } from '~utils/constants'

const TRANSPORT_OPTIONS = [
  { id: 1, label: 'Pickup' },
  { id: 2, label: 'Delivery' },
] as const

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
  location?: {
    latitude: number
    longitude: number
  }
}

interface ToolFormProps {
  initialData?: Partial<Tool>
  onSubmit: (data: ToolFormData) => Promise<void>
  submitButtonText: string
  isLoading?: boolean
  isError?: boolean
  error?: any
  onCancel?: () => void
}

export const ToolForm: React.FC<ToolFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText,
  isLoading,
  isError,
  error,
  onCancel,
}) => {
  const { t } = useTranslation()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ToolFormData>({
    defaultValues: {
      ...initialData,
      transportOptions: initialData?.transportOptions || [],
    },
  })

  const handleFormSubmit = async (data: ToolFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.somethingWentWrong'),
        status: 'error',
      })
    }
  }

  return (
    <Stack as='form' onSubmit={handleSubmit(handleFormSubmit)} spacing={6}>
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>{t('tools.name')}</FormLabel>
        <Input {...register('title', { required: true })} />
        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.description}>
        <FormLabel>{t('tools.description')}</FormLabel>
        <Textarea {...register('description', { required: true })} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <Checkbox {...register('mayBeFree')}>May Be Free</Checkbox>
      </FormControl>

      <FormControl>
        <Checkbox {...register('askWithFee')}>Ask With Fee</Checkbox>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.cost}>
        <FormLabel>Cost per day</FormLabel>
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
        <Select {...register('category', { required: true, valueAsNumber: true })}>
          {TOOL_CATEGORIES.map((category, index) => (
            <option key={category} value={index + 1}>
              {t(`categories.${category}`)}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.transportOptions}>
        <FormLabel>Transport Options</FormLabel>
        <Select {...register('transportOptions', { required: true, valueAsNumber: true })} multiple>
          {TRANSPORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.transportOptions?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.estimatedValue}>
        <FormLabel>Estimated Value</FormLabel>
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
        <FormLabel>Height (cm)</FormLabel>
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
        <FormLabel>Weight (kg)</FormLabel>
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

      <ImageUploader
        isRequired
        label={t('tools.images')}
        error={errors.images?.message}
        {...register('images', { required: !initialData })}
      />

      <Stack direction='row' spacing={4} justify='flex-end'>
        {onCancel && (
          <Button onClick={onCancel} variant='ghost'>
            {t('common.cancel')}
          </Button>
        )}
        <Button type='submit' colorScheme='primary' isLoading={isLoading}>
          {submitButtonText}
        </Button>
      </Stack>

      <FormSubmitMessage isError={isError} error={error} />
    </Stack>
  )
}
