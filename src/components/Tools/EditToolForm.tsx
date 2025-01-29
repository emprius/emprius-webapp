import { Box, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { useUploadImage } from '~components/Images/imagesQueries'
import { ROUTES } from '~src/router/router'
import { ToolForm, ToolFormData } from './ToolForm'
import { UpdateToolParams, useUpdateTool } from './toolsQueries'
import { Tool } from './types'

interface EditToolFormProps {
  initialData: Tool
}

export const EditToolForm: React.FC<EditToolFormProps> = ({ initialData: { images, ...initial } }) => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const toast = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { mutateAsync: uploadImage, isPending: uploadImageIsPending } = useUploadImage()
  const [existingImages, setExistingImages] = useState(images || [])

  const {
    mutateAsync: createTool,
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
      mayBeFree: data.mayBeFree,
      askWithFee: data.askWithFee,
      cost: Number(data.cost),
      transportOptions: data.transportOptions.map(Number),
      category: data.category,
      estimatedValue: Number(data.estimatedValue),
      height: Number(data.height),
      weight: Number(data.weight),
      location: data.location,
      images: allImageHashes,
      isAvailable: data.isAvailable,
    }

    await createTool({
      id: initial.id.toString(),
      ...updatedFields,
    })
  }

  const initialData = {
    ...initial,
    category: initial.toolCategory,
  }
  const isLoading = updateToolIsPending || uploadImageIsPending

  return (
    <Box>
      <ToolForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitButtonText={t('common.save')}
        isLoading={isLoading}
        isError={isError}
        error={error}
        existingImages={existingImages}
        onDeleteExistingImage={handleDeleteExistingImage}
      />
    </Box>
  )
}
