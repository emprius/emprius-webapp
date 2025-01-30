import { useToast } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~components/Auth/AuthContext'
import { useUploadImage } from '~components/Images/queries'
import { ToolForm, ToolFormData } from './Form'
import { useCreateTool } from './queries'

export const AddTool = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { mutateAsync: uploadImage, isPending: uploadImageIsPending } = useUploadImage()

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
      // Upload images first
      const imageFiles = Array.from(data.images)
      const imagePromises = imageFiles.map(async (file) => {
        const result = await uploadImage(file)
        return result.hash
      })
      imageHashes = await Promise.all(imagePromises)
    } catch (error) {
      toast({
        title: 'Failed to upload images',
        status: 'error',
        duration: 5000,
      })
      throw new Error('Failed to process images:', error)
    }

    // Create object with only non-null values
    // todo(kon): finally we have to send null values or not?
    // const toolData = {
    //   title: data.title,
    //   images: imageHashes,
    //   ...(data.description && { description: data.description }),
    //   ...(data.mayBeFree !== undefined && { mayBeFree: data.mayBeFree }),
    //   ...(data.askWithFee !== undefined && { askWithFee: data.askWithFee }),
    //   ...(!Number.isNaN(data.cost) && { cost: Number(data.cost) }),
    //   ...(data.transportOptions?.length && { transportOptions: data.transportOptions }),
    //   ...(data.category && { category: data.category }),
    //   ...(data.location && { location: data.location }),
    //   ...(!Number.isNaN(data.estimatedValue) && { estimatedValue: Number(data.estimatedValue) }),
    //   ...(!Number.isNaN(data.height) && { height: Number(data.height) }),
    //   ...(!Number.isNaN(data.weight) && { weight: Number(data.weight) }),
    // }
    //
    // await createTool(toolData)
    await createTool({
      title: data.title,
      description: data.description,
      mayBeFree: data.mayBeFree,
      askWithFee: data.askWithFee,
      cost: Number(data.cost),
      images: imageHashes,
      transportOptions: data.transportOptions || [],
      category: data.category,
      location: data.location,
      estimatedValue: Number(data.estimatedValue),
      height: Number(data.height),
      weight: Number(data.weight),
    })
  }

  const isLoading = createToolIsPending || uploadImageIsPending

  return (
    <ToolForm
      onSubmit={handleSubmit}
      submitButtonText={t('tools.create')}
      isLoading={isLoading}
      isError={isError}
      error={error}
      initialData={{ location: user.location }}
    />
  )
}
