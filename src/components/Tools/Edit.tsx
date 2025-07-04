import { Text, useToast } from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { useUploadImages } from '~components/Images/queries'
import { ROUTES } from '~src/router/routes'
import { CommunityOption, ToolForm, ToolFormData } from './Form'
import { useUpdateTool } from './queries'
import { Tool, UpdateToolParams } from './types'

interface EditToolFormProps {
  initialData: Tool
}

export const EditTool: React.FC<EditToolFormProps> = ({ initialData }) => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const toast = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const images = initialData.images
  const communities: CommunityOption[] = useMemo(
    () =>
      initialData?.communities?.map((id) => ({
        value: id,
        label: '',
        avatarHash: '',
      })) || [],
    [initialData.communities]
  )

  const {
    mutateAsync: uploadImages,
    isPending: uploadImagesIsPending,
    isError: isImageError,
    error: imageError,
  } = useUploadImages()
  const [existingImages, setExistingImages] = useState(images || [])
  const [hadInitialImages] = useState(!!images?.length)

  const {
    mutateAsync,
    isPending: updateToolIsPending,
    isError: isUpdateError,
    error: updateError,
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
  if (user?.id !== initialData.userId) {
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
      newImageHashes = await uploadImages(data.images)
    }

    // Combine existing image hashes with new image hashes
    const allImageHashes = [...existingImages, ...newImageHashes]

    const updatedFields: Omit<UpdateToolParams, 'id'> = {
      ...data,
      toolValuation: Number(data.toolValuation),
      cost: Number(data.cost),
      height: Number(data.height),
      weight: Number(data.weight),
      images: allImageHashes,
      communities: data?.communities?.map((c) => c.value) || [],
    }

    await mutateAsync({
      id: initialData.id.toString(),
      ...updatedFields,
    })
  }

  const isLoading = updateToolIsPending || uploadImagesIsPending
  const isError = isUpdateError || isImageError
  const error = updateError || imageError

  return (
    <ToolForm
      initialData={{
        ...initialData,
        communities,
        images: undefined, // Remove images from initial data as they're handled separately
      }}
      existingImages={existingImages}
      onSubmit={handleSubmit}
      submitButtonText={t('common.save')}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onDeleteExistingImage={handleDeleteExistingImage}
      validateImages={validateImages}
      tool={initialData}
    />
  )
}
