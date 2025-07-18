import { ChevronDownIcon, ChevronUpIcon, CloseIcon, FormHelperText } from '@chakra-ui/icons'
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
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Image, ServerImage } from '~components/Images/ServerImage'
import { useInfoContext } from '~components/Layout/Contexts/InfoContext'
import FormSubmitMessage from '~components/Layout/Form/FormSubmitMessage'
import { MultipleImageSelector } from '~components/Images/MultipleImageSelector'
import { DeleteToolButton } from '~components/Tools/shared/OwnerToolButtons'
import { CreateToolParams, ToolDetail } from '~components/Tools/types'
import { useAuth } from '~components/Auth/AuthContext'
import { MaybeFree } from '~components/Tools/Form/MaybeFree'
import { CommunitiesSelector } from '~components/Tools/Form/CommunitiesSelector'
import EditToolLocation from '~components/Tools/Form/EditToolLocation'
import IsNomadic from '~components/Tools/Form/IsNomadic'

export type CommunityOption = {
  value: string
  label: string
  avatarHash: string
}

export type ToolFormData = Omit<CreateToolParams, 'images' | 'communities'> & {
  images: FileList
  id?: number
  communities?: CommunityOption[]
}

interface ToolFormProps {
  initialData?: Partial<ToolFormData>
  onSubmit: (data: ToolFormData) => Promise<void>
  submitButtonText: string
  isLoading?: boolean
  isError?: boolean
  error?: any
  existingImages?: Image[]
  onDeleteExistingImage?: (index: number) => void
  validateImages?: (images: FileList) => string | true
  tool?: ToolDetail
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
  validateImages,
  tool,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { categories } = useInfoContext()
  const { user } = useAuth()
  const isToolEditMode = !!tool

  const methods = useForm<ToolFormData>({
    defaultValues: {
      ...initialData,
      isAvailable: initialData?.isAvailable ?? true,
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = methods

  const handleFormSubmit = async (data: ToolFormData) => {
    await onSubmit(data)
  }

  const { isOpen, onToggle } = useDisclosure()
  const isNomadicChangeDisabled = isToolEditMode && tool?.actualUserId && tool?.actualUserId !== user.id

  return (
    <FormProvider {...methods}>
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

        <MaybeFree cost={tool?.cost} estimatedDailyCost={tool?.estimatedDailyCost} />

        <CommunitiesSelector hasCommunities={!!initialData?.communities?.length} />

        <IsNomadic isNomadicChangeDisabled={isNomadicChangeDisabled} />

        <EditToolLocation />

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
          disabled={isLoading}
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

            <FormControl isInvalid={!!errors.maxDistance}>
              <FormLabel>{t('tools.maxDistance', { defaultValue: 'Max distance (km)' })}</FormLabel>
              <NumberInput min={1} precision={0}>
                <NumberInputField
                  {...register('maxDistance', {
                    valueAsNumber: true,
                    setValueAs: (value) => (value === '' ? undefined : parseInt(value)),
                  })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                {t('tools.maxDistance_desc', {
                  defaultValue: 'Maximum loan distance, preventing users from booking if they are too far away',
                })}
              </FormHelperText>
              <FormErrorMessage>{errors.weight?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
        </Collapse>

        <Stack align={'end'}>
          <Stack direction='row' spacing={4} justify='flex-end'>
            <FormSubmitMessage isError={isError} error={error} />
          </Stack>
          <Stack direction='row' spacing={4} justify='space-between' w={'full'} align={'start'} wrap={'wrap-reverse'}>
            {isToolEditMode && <DeleteToolButton toolId={initialData?.id} disabled={isLoading} />}
            <Stack direction='row' spacing={4} justify='flex-end' flex={1}>
              <Button onClick={() => navigate(-1)} variant='ghost'>
                {t('common.cancel')}
              </Button>
              <Button type='submit' colorScheme='primary' isLoading={isLoading}>
                {submitButtonText}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </FormProvider>
  )
}
