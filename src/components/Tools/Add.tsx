import { useToast } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { useUploadImages } from '~components/Images/queries'
import { ToolForm, ToolFormData } from './Form'
import { useCreateTool } from './queries'

export const AddTool = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const {
    mutateAsync: uploadImages,
    isPending: uploadImagesIsPending,
    isError: isImageError,
    error: imageError,
  } = useUploadImages()

  const {
    mutateAsync: createTool,
    isPending: createToolIsPending,
    isError: isCreateError,
    error: createError,
  } = useCreateTool({
    onSuccess: () => {
      toast({
        title: t('tools.create_success'),
        status: 'success',
        duration: 3000,
      })
      navigate('/tools')
    },
    onError: (error) => {
      console.error('Failed to create tool:', error)
      toast({
        title: t('tools.create_error'),
        status: 'error',
        duration: 5000,
      })
    },
  })

  const handleSubmit = async (data: ToolFormData) => {
    let imageHashes: string[] = []
    imageHashes = await uploadImages(data.images)
    await createTool({
      ...data,
      images: imageHashes,
      toolValuation: Number(data.toolValuation) || 0,
      height: Number(data.height),
      weight: Number(data.weight),
      isNomadic: data?.isNomadic ?? false,
      communities: data?.communities?.map((c) => c.value) || [],
    })
  }

  const isLoading = createToolIsPending || uploadImagesIsPending
  const isError = isCreateError || isImageError
  const error = createError || imageError

  return (
    <ToolForm
      onSubmit={handleSubmit}
      submitButtonText={t('tools.create')}
      isLoading={isLoading}
      isError={isError}
      error={error}
      initialData={{ location: user.location, toolValuation: 0 }}
    />
  )
}
