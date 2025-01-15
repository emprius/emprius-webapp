import React from 'react'
import { Box, Text, useToast } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { UpdateToolParams, useUpdateTool } from '../toolsQueries'
import { Tool } from '~src/types'
import { useAuth } from '~src/features/auth/context/AuthContext'
import { ToolForm, ToolFormData } from './ToolForm'
import { useNavigate } from 'react-router-dom'
import { useUploadImage } from '~src/hooks/queries'

interface EditToolFormProps {
  initialData: Tool
  onSuccess?: () => void
}

export const EditToolForm: React.FC<EditToolFormProps> = ({ initialData, onSuccess }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { mutateAsync: uploadImage, isPending: uploadImageIsPending } = useUploadImage()

  const {
    mutateAsync: createTool,
    isPending: updateToolIsPending,
    isError,
    error,
  } = useUpdateTool({
    onSuccess: () => {
      toast({
        title: t('tools.updateSuccesss'),
        status: 'success',
        duration: 3000,
      })
      // todo(konv1): use defined routes
      navigate('/tools')
    },
    onError: (error) => {
      console.error('Failed to update tool:', error)
      toast({
        title: t('tools.updateError'),
        status: 'error',
        duration: 5000,
      })
    },
  })

  // Only allow editing if the current user is the tool owner
  if (user?.email !== initialData.userId) {
    return <Text color='red.500'>{t('tools.notOwner')}</Text>
  }

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
      images: imageHashes,
    }

    await createTool({
      id: initialData.id.toString(),
      ...updatedFields,
    })
  }

  const formInitialData = {
    ...initialData,
    category: initialData.toolCategory,
  }
  const isLoading = updateToolIsPending || uploadImageIsPending

  return (
    <Box>
      <ToolForm
        initialData={formInitialData}
        onSubmit={handleSubmit}
        submitButtonText={t('common.save')}
        isLoading={isLoading}
        onCancel={onSuccess}
        isError={isError}
        error={error}
      />
    </Box>
  )
}
