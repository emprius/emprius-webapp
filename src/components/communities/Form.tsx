import React, { useRef, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  VisuallyHidden,
  Image,
  Text,
  Flex,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Community, CommunityFormData } from './types'
import { useCreateCommunity, useUpdateCommunity } from './queries'
import { ROUTES } from '~src/router/routes'
import { INPUT_ACCEPTED_IMAGE_TYPES } from '~utils/images'
import { ServerImage } from '~components/Images/ServerImage'

interface CommunityFormProps {
  initialData?: Community
  isEdit?: boolean
}

export const CommunityForm: React.FC<CommunityFormProps> = ({ initialData, isEdit = false }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const navigate = useNavigate()
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutateAsync: createCommunity, isPending: isCreating } = useCreateCommunity()
  const { mutateAsync: updateCommunity, isPending: isUpdating } = useUpdateCommunity()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommunityFormData>({
    defaultValues: {
      name: initialData?.name || '',
    },
  })

  const onSubmit = async (data: CommunityFormData) => {
    try {
      if (isEdit && initialData) {
        await updateCommunity({
          id: initialData.id,
          data: {
            ...data,
            image: image,
          },
        })
        toast({
          title: t('communities.updated'),
          status: 'success',
          duration: 3000,
        })
        navigate(ROUTES.COMMUNITIES.DETAIL.replace(':id', initialData.id))
      } else {
        const newCommunity = await createCommunity({
          ...data,
          image: image,
        })
        toast({
          title: t('communities.created'),
          status: 'success',
          duration: 3000,
        })
        navigate(ROUTES.COMMUNITIES.DETAIL.replace(':id', newCommunity.id))
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('common.something_went_wrong'),
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImage(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
  }

  const handleSelectImage = () => {
    fileInputRef.current?.click()
  }

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>{t('communities.name')}</FormLabel>
          <Input
            {...register('name', {
              required: t('common.required'),
              minLength: {
                value: 3,
                message: t('communities.name_too_short'),
              },
            })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>{t('communities.image')}</FormLabel>
          <VisuallyHidden>
            <Input type='file' accept={INPUT_ACCEPTED_IMAGE_TYPES} onChange={handleImageChange} ref={fileInputRef} />
          </VisuallyHidden>

          <Button onClick={handleSelectImage} mb={4}>
            {t('communities.select_image')}
          </Button>

          {preview ? (
            <Box mt={4} maxW='200px'>
              <Image src={preview} alt={t('communities.preview')} borderRadius='md' />
            </Box>
          ) : initialData?.imageHash ? (
            <Box mt={4} maxW='200px'>
              <ServerImage
                imageId={initialData.imageHash}
                alt={initialData.name}
                fallbackSrc='/assets/logos/tool-fallback.svg'
              />
            </Box>
          ) : (
            <Text mt={2} color='gray.500'>
              {t('communities.no_image_selected')}
            </Text>
          )}
        </FormControl>

        <Stack direction='row' spacing={4} justify='flex-end'>
          <Button
            variant='ghost'
            onClick={() =>
              navigate(
                isEdit && initialData
                  ? ROUTES.COMMUNITIES.DETAIL.replace(':id', initialData.id)
                  : ROUTES.COMMUNITIES.LIST
              )
            }
          >
            {t('common.cancel')}
          </Button>
          <Button type='submit' colorScheme='primary' isLoading={isCreating || isUpdating}>
            {isEdit ? t('common.save') : t('communities.create')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
