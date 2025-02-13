import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Checkbox,
  Collapse,
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Image, ServerImage } from '~components/Images/ServerImage'
import { useInfoContext } from '~components/InfoProviders/InfoContext'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { LocationPicker } from '~components/Layout/Form/LocationPicker'
import { MultipleImageSelector } from '~components/Layout/Form/MultipleImageSelector'
import { EmpriusLocation } from '~components/Layout/types'
import { DeleteToolButton } from '~components/Tools/shared/OwnerToolButtons'
import { Tool } from './types'

export interface ToolFormData {
  title: string
  description: string
  mayBeFree: boolean
  askWithFee: boolean
  cost: number
  transportOptions: number[]
  toolCategory?: number
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
  isEdit?: boolean
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
  isEdit,
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

  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack as='form' onSubmit={handleSubmit(handleFormSubmit)} spacing={6}>
      <Stack direction={{ base: 'column-reverse', md: 'row' }} justify={'space-between'} flex={1} spacing={6}>
        <FormControl isRequired isInvalid={!!errors.title}>
          <FormLabel>{t('tools.name')}</FormLabel>
          <Input {...register('title', { required: true })} />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          as={Stack}
          alignItems={'center'}
          direction={'row'}
          wrap={'wrap'}
          pt={{ base: 0, md: 6 }}
          justifyContent={{ base: 'start', md: 'end' }}
        >
          <FormLabel mb='0'>{t('tools.is_available')}</FormLabel>
          <Switch size={'lg'} {...register('isAvailable')} />
        </FormControl>
      </Stack>

      <FormControl isInvalid={!!errors.toolCategory} isRequired>
        <FormLabel>{t('tools.toolCategory')}</FormLabel>
        <Select
          name='toolCategory'
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          value={
            watch('toolCategory')
              ? {
                  value: watch('toolCategory'),
                  label: categories.find((c) => c.id === watch('toolCategory'))?.name || '',
                }
              : null
          }
          onChange={(newValue: any) => {
            setValue('toolCategory', newValue?.value, { shouldValidate: true })
          }}
          placeholder={t('tools.select_category', { defaultValue: 'Select category' })}
          required
          chakraStyles={{
            menuList: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
          }}
        />
        <FormErrorMessage>{errors.toolCategory?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description}>
        <FormLabel>{t('tools.description')}</FormLabel>
        <Textarea {...register('description', {})} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired>
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
              <Box key={image} position='relative'>
                <ServerImage imageId={image} objectFit='cover' w='100%' h='100px' borderRadius='md' />
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

      <MultipleImageSelector label={t('tools.images')} error={errors.images?.message} {...register('images')} />

      {/* Optional Fields Toggle Button */}
      <Button
        onClick={onToggle}
        variant='ghost'
        rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        width='100%'
      >
        {t('common.additional_options', { defaultValue: 'Additional Options' })}
      </Button>

      {/* Optional Fields */}
      <Collapse in={isOpen} animateOpacity>
        <Stack spacing={6}>
          <FormControl>
            <Checkbox {...register('mayBeFree')}>{t('tools.may_be_free', { defaultValue: 'May Be Free' })}</Checkbox>
          </FormControl>

          <FormControl>
            <Checkbox {...register('askWithFee')}>{t('tools.ask_with_fee', { defaultValue: 'Ask With Fee' })}</Checkbox>
          </FormControl>

          <FormControl isInvalid={!!errors.cost}>
            <FormLabel>{t('tools.cost_per_day', { defaultValue: 'Cost per day' })}</FormLabel>
            <NumberInput min={0} precision={0}>
              <NumberInputField
                {...register('cost', {
                  valueAsNumber: true,
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.cost?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.estimatedValue}>
            <FormLabel>{t('tools.estimated_value', { defaultValue: 'Estimated Value' })}</FormLabel>
            <NumberInput min={0} precision={0}>
              <NumberInputField
                {...register('estimatedValue', {
                  valueAsNumber: true,
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.estimatedValue?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.height}>
            <FormLabel>{t('tools.height', { defaultValue: 'Height (cm)' })}</FormLabel>
            <NumberInput min={0} precision={0}>
              <NumberInputField
                {...register('height', {
                  valueAsNumber: true,
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.height?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.weight}>
            <FormLabel>{t('tools.weight', { defaultValue: 'Weight (kg)' })}</FormLabel>
            <NumberInput min={0} precision={0}>
              <NumberInputField
                {...register('weight', {
                  valueAsNumber: true,
                  setValueAs: (value) => (value === '' ? undefined : parseInt(value)),
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.weight?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
      </Collapse>

      <Stack direction='row' spacing={4} justify='flex-end'>
        <Button onClick={() => navigate(-1)} variant='ghost'>
          {t('common.cancel')}
        </Button>
        <Button type='submit' colorScheme='primary' isLoading={isLoading}>
          {submitButtonText}
        </Button>
        {isEdit && <DeleteToolButton toolId={initialData.id} />}
      </Stack>

      <FormSubmitMessage isError={isError} error={error} />
    </Stack>
  )
}
