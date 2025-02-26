import { useToast } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { useUploadImages } from '~components/Images/queries'
import { ToolFormData } from '~components/Tools/types'
import { ToolForm } from './Form'
import { useCreateTool } from './queries'

export const AddTool = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { mutateAsync: uploadImages, isPending: uploadImagesIsPending } = useUploadImages()

  const {
    mutateAsync: createTool,
    isPending: createToolIsPending,
    isError,
    error,
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
    try {
      imageHashes = await uploadImages(data.images)
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
      cost: Number(data.cost),
      images: imageHashes,
      toolCategory: data.toolCategory,
      location: data.location,
      estimatedValue: Number(data.estimatedValue) || 0,
      height: Number(data.height),
      weight: Number(data.weight),
    })
  }

  const isLoading = createToolIsPending || uploadImagesIsPending

  return (
    <ToolForm
      onSubmit={handleSubmit}
      submitButtonText={t('tools.create')}
      isLoading={isLoading}
      isError={isError}
      error={error}
      initialData={{ location: user.location, estimatedValue: 0 }}
    />
  )
}
