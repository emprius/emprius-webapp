import { Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { useUploadImage } from '~components/Images/queries'
import { ROUTES } from '~src/router/routes'
import { ToolForm } from './Form'
import { UpdateToolParams, useUpdateTool } from './queries'
import { Tool, ToolFormData } from './types'

interface EditToolFormProps {
  initialData: Tool
}

export const EditTool: React.FC<EditToolFormProps> = ({ initialData: { images, ...initial } }) => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const toast = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { mutateAsync: uploadImage, isPending: uploadImageIsPending } = useUploadImage()
  const [existingImages, setExistingImages] = useState(images || [])
  const [hadInitialImages] = useState(!!images?.length)

  const {
    mutateAsync,
    isPending: updateToolIsPending,
    isError,
    error,
  } = useUpdateTool({
    onSuccess: () => {
      toast({
        title: t('tools.update_success'),
        status: 'success',
        duration: 3000,
      })
      navigate(ROUTES.TOOLS.DETAIL.replace(':id', id!))
    },
    onError: (error) => {
      console.error('Failed to update tool:', error)
      toast({
        title: t('tools.update_error'),
        status: 'error',
        duration: 5000,
      })
    },
  })

  // Only allow editing if the current user is the tool owner
  if (user?.id !== initial.userId) {
    return <Text color='red.500'>{t('tools.not_owner')}</Text>
  }

  const handleDeleteExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const validateImages = (images: FileList) => {
    if (hadInitialImages && !existingImages.length && !images.length) {
      return t('tools.cannot_delete_all_images')
    }
    return true
  }

  const handleSubmit = async (data: ToolFormData) => {
    let newImageHashes: string[] = []

    if (data.images.length) {
      try {
        // Upload new images first
        const imageFiles = Array.from(data.images)
        const imagePromises = imageFiles.map(async (file) => {
          const result = await uploadImage(file)
          return result.hash
        })
        newImageHashes = await Promise.all(imagePromises)
      } catch (error) {
        toast({
          title: 'Failed to upload images',
          status: 'error',
          duration: 5000,
        })
        throw new Error('Failed to process images:', error)
      }
    }

    // Combine existing image hashes with new image hashes
    const allImageHashes = [...existingImages, ...newImageHashes]

    const updatedFields: Omit<UpdateToolParams, 'id'> = {
      title: data.title,
      description: data.description,
      cost: Number(data.cost),
      toolCategory: data.toolCategory,
      estimatedValue: Number(data.estimatedValue),
      height: Number(data.height),
      weight: Number(data.weight),
      location: data.location,
      images: allImageHashes,
      isAvailable: data.isAvailable,
    }

    await mutateAsync({
      id: initial.id.toString(),
      ...updatedFields,
    })
  }

  const initialData = {
    ...initial,
  }
  const isLoading = updateToolIsPending || uploadImageIsPending

  return (
    <ToolForm
      initialData={{
        ...initialData,
        images: undefined // Remove images from initial data as they're handled separately
      }}
      onSubmit={handleSubmit}
      submitButtonText={t('common.save')}
      isLoading={isLoading}
      isError={isError}
      error={error}
      existingImages={existingImages}
      onDeleteExistingImage={handleDeleteExistingImage}
      isEdit
      validateImages={validateImages}
    />
  )
}
