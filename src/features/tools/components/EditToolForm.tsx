import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Switch,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { LocationPicker } from '~src/components/shared/Form/LocationPicker'
import { useUpdateTool } from '../toolsQueries'
import { ImageContent, Tool } from '~src/types'
import { getB64FromFile } from '~src/utils'
import { useAuth } from '~src/features/auth/context/AuthContext'
import { ImageUploader } from '~src/components/shared/Form/ImageUploader'

interface EditToolFormProps {
  initialData: Tool
  onSuccess?: () => void
}

type EditToolFormData = Omit<Tool, 'id' | 'userId' | 'rating' | 'isAvailable' | 'reservedDates'> & {
  images: ImageContent[]
}

export const EditToolForm: React.FC<EditToolFormProps> = ({ initialData, onSuccess }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const updateTool = useUpdateTool()
  const { user } = useAuth()
  const [newImages, setNewImages] = useState<File[]>([])

  // Only allow editing if the current user is the tool owner
  if (user?.email !== initialData.userId) {
    return <Text color='red.500'>{t('tools.notOwner')}</Text>
  }

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
    setValue,
  } = useForm<EditToolFormData>({
    defaultValues: {
      ...initialData,
      // Convert Image[] to ImageContent[] for the form
      images: initialData.images.map((img) => ({
        ...img,
        content: '', // We'll only send content for new images
      })),
    },
  })

  const onSubmit = async (data: EditToolFormData) => {
    // Create an object with only the modified fields
    const updatedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      const fieldKey = key as keyof EditToolFormData
      return {
        ...acc,
        [fieldKey]: data[fieldKey],
      }
    }, {} as Partial<EditToolFormData>)

    try {
      // Handle image updates if there are new images
      if (newImages.length > 0) {
        const imagePromises = newImages.map(async (file) => {
          const content = await getB64FromFile(file)
          return {
            content,
            name: file.name,
            hash: Math.random().toString(36).substring(7), // Generate a temporary hash
          } as ImageContent
        })
        updatedFields.images = await Promise.all(imagePromises)
      }

      // Include location if it was modified
      if (data.location !== initialData.location) {
        updatedFields.location = data.location
      }

      await updateTool.mutateAsync({
        id: initialData.id.toString(),
        ...updatedFields,
      })

      toast({
        title: t('common.success'),
        description: t('tools.toolUpdated'),
        status: 'success',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.somethingWentWrong'),
        status: 'error',
      })
    }
  }

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={6} align='stretch'>
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>{t('tools.title')}</FormLabel>
          <Input
            {...register('title', {
              required: t('common.required'),
            })}
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>{t('tools.description')}</FormLabel>
          <Input
            {...register('description', {
              required: t('common.required'),
            })}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <ImageUploader
            {...register('images', {
              onChange: (e) => {
                if (e.target.files) {
                  setNewImages(Array.from(e.target.files))
                }
              },
            })}
            name='images'
            label={t('tools.images')}
            error={errors.images?.message}
          />
        </FormControl>

        <FormControl>
          <FormLabel mb='0'>{t('tools.mayBeFree')}</FormLabel>
          <Switch {...register('mayBeFree')} />
        </FormControl>

        <FormControl>
          <FormLabel mb='0'>{t('tools.askWithFee')}</FormLabel>
          <Switch {...register('askWithFee')} />
        </FormControl>

        <FormControl isInvalid={!!errors.cost}>
          <FormLabel>{t('tools.cost')}</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              {...register('cost', {
                required: t('common.required'),
                min: {
                  value: 0,
                  message: t('tools.costMinValue'),
                },
              })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.cost?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.estimatedValue}>
          <FormLabel>{t('tools.estimatedValue')}</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              {...register('estimatedValue', {
                required: t('common.required'),
                min: {
                  value: 0,
                  message: t('tools.valueMinValue'),
                },
              })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.estimatedValue?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.height}>
          <FormLabel>{t('tools.height')}</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              {...register('height', {
                required: t('common.required'),
                min: {
                  value: 0,
                  message: t('tools.dimensionMinValue'),
                },
              })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.height?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.weight}>
          <FormLabel>{t('tools.weight')}</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              {...register('weight', {
                required: t('common.required'),
                min: {
                  value: 0,
                  message: t('tools.dimensionMinValue'),
                },
              })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.weight?.message}</FormErrorMessage>
        </FormControl>

        <LocationPicker
          value={watch('location')}
          onChange={(location) => setValue('location', location)}
          error={errors.location?.message}
        />

        <Stack direction='row' spacing={4} justify='flex-end'>
          <Button onClick={onSuccess} variant='ghost'>
            {t('common.cancel')}
          </Button>
          <Button type='submit' colorScheme='blue' isLoading={updateTool.isPending} loadingText={t('common.saving')}>
            {t('common.save')}
          </Button>
        </Stack>
      </VStack>
    </Box>
  )
}
