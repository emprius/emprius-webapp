import { useMutation } from '@tanstack/react-query'
import api from '~src/services/api'
import { getB64FromFile } from '~src/utils'
import { useTranslation } from 'react-i18next'
import { useToast } from '@chakra-ui/react'

export const useUploadImage = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const base64 = await getB64FromFile(file)
      return api.images.uploadImage(base64)
    },
  })

export const useUploadImages = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const { mutateAsync: uploadImage, isPending: uploadImageIsPending } = useUploadImage()
  return useMutation({
    mutationFn: async (files: FileList) => {
      const imageFiles = Array.from(files)
      const imagePromises = imageFiles.map(async (file) => {
        const result = await uploadImage(file)
        return result.hash
      })
      return await Promise.all(imagePromises)
    },
    onError: (error) => {
      toast({
        title: t('common.image_upload_error'),
        description: t('common.image_upload_error_description'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      throw error
    },
  })
}
