import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCreateTool } from '~src/features/tools/toolsQueries'
import { useUploadImage } from '~src/hooks/queries'
import { TOOL_CATEGORIES } from '../../../constants'
import { LocationPicker } from '~components/shared/Form/LocationPicker'
import { ImageUploader } from '~components/shared/Form/ImageUploader'
import FormSubmitMessage from '~components/Layout/FormSubmitMessage'

const TRANSPORT_OPTIONS = [
  { id: 1, label: 'Pickup' },
  { id: 2, label: 'Delivery' },
] as const

interface NewToolForm {
  title: string
  description: string
  mayBeFree: boolean
  askWithFee: boolean
  cost: number
  transportOptions: number[]
  category: number
  estimatedValue: number
  height: number
  weight: number
  images: FileList
  location?: {
    latitude: number
    longitude: number
  }
}

export const NewToolPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const { mutateAsync: uploadImage, isPending: uploadImageIsPending } = useUploadImage()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewToolForm>()

  const {
    mutateAsync: createTool,
    isPending: createToolIsPending,
    isError,
    error,
  } = useCreateTool({
    onSuccess: () => {
      toast({
        title: t('tools.createSuccess'),
        status: 'success',
        duration: 3000,
      })
      navigate('/tools')
    },
    onError: (error) => {
      console.error('Failed to create tool:', error)
      toast({
        title: t('tools.createError'),
        status: 'error',
        duration: 5000,
      })
    },
  })

  const onSubmit = async (data: NewToolForm) => {
    let imageHashes: string[] = []
    try {
      // Upload images first
      const imageFiles = Array.from(data.images)
      const imagePromises = imageFiles.map(async (file) => {
        const result = await uploadImage(file)
        return result.hash
      })
      imageHashes = await Promise.all(imagePromises)
    } catch (error) {
      toast({
        title: 'Failed to upload images',
        status: 'error',
        duration: 5000,
      })
      throw new Error('Failed to process images:', error)
    }

    await createTool({
      title: data.title,
      description: data.description,
      mayBeFree: data.mayBeFree,
      askWithFee: data.askWithFee,
      cost: Number(data.cost),
      images: imageHashes,
      transportOptions: Array.isArray(data.transportOptions) ? data.transportOptions : [data.transportOptions],
      category: data.category,
      location: data.location,
      estimatedValue: Number(data.estimatedValue),
      height: Number(data.height),
      weight: Number(data.weight),
    })
  }

  const isLoading = createToolIsPending || uploadImageIsPending

  return (
    <Container maxW='container.md' py={8}>
      <Stack
        as='form'
        onSubmit={handleSubmit(onSubmit)}
        spacing={6}
        bg={bgColor}
        p={8}
        borderRadius='lg'
        boxShadow='sm'
      >
        <Heading size='lg'>{t('tools.addTool')}</Heading>

        <FormControl isRequired isInvalid={!!errors.title}>
          <FormLabel>{t('tools.name')}</FormLabel>
          <Input {...register('title', { required: true })} />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.description}>
          <FormLabel>{t('tools.description')}</FormLabel>
          <Textarea {...register('description', { required: true })} />
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
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Location</FormLabel>
          <LocationPicker
            onChange={(location) => {
              const event = {
                target: {
                  name: 'location',
                  value: location,
                },
              }
              register('location').onChange(event)
            }}
            value={watch('location')}
          />
          <FormErrorMessage>{errors.location && errors.location.message}</FormErrorMessage>
        </FormControl>

        <ImageUploader
          isRequired
          label={t('tools.images')}
          error={errors.images?.message}
          {...register('images', { required: true })}
        />

        <Button type='submit' colorScheme='primary' size='lg' isLoading={isLoading}>
          {t('tools.create')}
        </Button>
        <FormSubmitMessage isError={isError} error={error} />
      </Stack>
    </Container>
  )
}
