import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
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
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Image, ServerImage } from '~components/Images/ServerImage'
import { useInfoContext } from '~components/InfoProviders/InfoContext'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { LocationPicker } from '~components/Layout/Form/LocationPicker'
import { MultipleImageSelector } from '~components/Layout/Form/MultipleImageSelector'
import { DeleteToolButton } from '~components/Tools/shared/OwnerToolButtons'
import { lighterText } from '~theme/common'
import { ToolFormData } from './types'

interface ToolFormProps {
  initialData?: Partial<ToolFormData>
  onSubmit: (data: ToolFormData) => Promise<void>
  submitButtonText: string
  isLoading?: boolean
  isError?: boolean
  error?: any
  existingImages?: Image[]
  onDeleteExistingImage?: (index: number) => void
  isEdit?: boolean
  validateImages?: (images: FileList) => string | true
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
  validateImages,
}) => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const { categories } = useInfoContext()

  const {
    register,
    handleSubmit,
    watch,
    control,
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

      <MaybeFree control={control} setValue={setValue} watch={watch} errors={errors} />

      <LocationPicker name='location' control={control} isRequired={true} />

      {existingImages.length > 0 && (
        <Box mb={6}>
          <Text mb={2} fontWeight='medium'>
            {t('tools.existing_images')}
          </Text>
          <SimpleGrid columns={[2, 3, 4]} spacing={4}>
            {existingImages.map((image, index) => (
              <Box key={image} position='relative'>
                <ServerImage imageId={image} objectFit='cover' w='100%' h='100px' borderRadius='md' thumbnail />
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

      <MultipleImageSelector
        label={t('tools.images')}
        error={errors.images?.message}
        {...register(
          'images',
          validateImages
            ? {
                validate: validateImages,
              }
            : {}
        )}
      />

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
          <FormControl isInvalid={!!errors.height}>
            <FormLabel>{t('tools.height', { defaultValue: 'Height (cm)' })}</FormLabel>
            <NumberInput min={1} precision={0}>
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
            <NumberInput min={1} precision={0}>
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

interface MaybeFreeProps {
  control: any
  setValue: (name: keyof ToolFormData, value: any) => void
  watch: (name: keyof ToolFormData) => any
  errors: any
}

const MaybeFree: React.FC<MaybeFreeProps> = ({ control, setValue, watch, errors }) => {
  const { t } = useTranslation()
  const [isFree, setIsFree] = useState(false)

  useEffect(() => {
    // Check initial value and set switch state
    const value = watch('estimatedValue')
    if (value === 0) {
      setIsFree(true)
    }
  }, [])

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsFree(checked)
    if (checked) {
      setValue('estimatedValue', 0)
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align='start'>
        <FormControl display='flex' flexDirection={'column'} alignItems='start' width='auto' gap={1}>
          <FormLabel htmlFor='isFree' mr={3}>
            {t('tools.is_free')}
          </FormLabel>
          <Text fontSize='sm' sx={lighterText}>
            {t('tools.tool_is_free_description', {
              defaultValue: 'No cost associated for loan the tool',
            })}
          </Text>
          <Switch mt={4} id='isFree' isChecked={isFree} onChange={handleSwitchChange} size={'lg'} />
        </FormControl>
        <FormControl flex={1} isDisabled={isFree} isInvalid={!!errors.estimatedValue} isRequired={!isFree}>
          <FormLabel>{t('tools.estimated_value', { defaultValue: 'Estimated Value' })}</FormLabel>
          <Text fontSize='sm' sx={lighterText}>
            {t('tools.tool_estimated_value_description', {
              defaultValue:
                'Set the estimated value of your tool. If the tool is not free, this value will be used to calculate the cost per day.',
            })}
          </Text>
          <Controller
            name='estimatedValue'
            control={control}
            rules={{
              validate: (value) => {
                if (!isFree && (!value || value <= 0)) {
                  return t('tools.value_must_be_greater_than_zero', { defaultValue: 'Value must be greater than 0' })
                }
                return true
              },
            }}
            render={({ field }) => (
              <NumberInput min={0} precision={0} isDisabled={isFree} {...field}>
                <NumberInputField placeholder={t('tools.enter_estimated_value')} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <FormErrorMessage>{errors.estimatedValue?.message}</FormErrorMessage>
        </FormControl>
      </Stack>
    </Stack>
  )
}
