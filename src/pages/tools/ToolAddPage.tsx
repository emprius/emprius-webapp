import { Container, Heading, Stack, useColorModeValue, useToast } from '@chakra-ui/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useUploadImage } from '~components/Images/imagesQueries'
import { ToolForm, ToolFormData } from '~components/Tools/ToolForm'
import { useCreateTool } from '~components/Tools/toolsQueries'

export const ToolAddPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const { mutateAsync: uploadImage, isPending: uploadImageIsPending } = useUploadImage()

  const {
    mutateAsync: createTool,
    isPending: createToolIsPending,
    isError,
    error,
  } = useCreateTool({
    onSuccess: () => {
      toast({
        title: t('tools.createSuccess'),
        status: 'success',
        duration: 3000,
      })
      navigate('/tools')
    },
    onError: (error) => {
      console.error('Failed to create tool:', error)
      toast({
        title: t('tools.createError'),
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

    await createTool({
      title: data.title,
      description: data.description,
      mayBeFree: data.mayBeFree,
      askWithFee: data.askWithFee,
      cost: Number(data.cost),
      images: imageHashes,
      transportOptions: data.transportOptions.map(Number),
      category: data.category,
      estimatedValue: Number(data.estimatedValue),
      height: Number(data.height),
      weight: Number(data.weight),
    })
  }

  const isLoading = createToolIsPending || uploadImageIsPending

  return (
    <Container maxW='container.md' py={8}>
      <Stack bg={bgColor} p={8} borderRadius='lg' boxShadow='sm' spacing={6}>
        <Heading size='lg'>{t('tools.addTool')}</Heading>
        <ToolForm
          onSubmit={handleSubmit}
          submitButtonText={t('tools.create')}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </Stack>
    </Container>
  )
}
