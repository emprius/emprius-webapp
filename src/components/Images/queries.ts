import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useToast } from '@chakra-ui/react'
import api from '~src/services/api'
import { getB64FromFile } from '~src/utils'

export class ImageUploadError extends Error {
  public raw: Error

  constructor(message: string, raw?: Error) {
    super(message)
    this.raw = raw
    this.name = 'ImageUploadError'
  }
}

export type ImageUploadResponse = { hash: string }

export const useUploadImage = (
  options?: Omit<UseMutationOptions<ImageUploadResponse, ImageUploadError | Error, File>, 'mutationFn'>
) =>
  useMutation({
    mutationFn: async (file: File) => {
      const base64 = await getB64FromFile(file)
      try {
        return api.images.uploadImage(base64)
      } catch (error) {
        // This is a custom error that will be caught in the onError
        throw new ImageUploadError(error.message, error)
      }
    },
    ...options,
  })

export const useUploadImages = (
  options?: Omit<UseMutationOptions<string[], Error | ImageUploadError, FileList>, 'mutationFn'>
) => {
  const { t } = useTranslation()
  const toast = useToast()
  const { mutateAsync: uploadImage, isPending: uploadImageIsPending } = useUploadImage({
    retry: 1,
  })
  return useMutation({
    mutationFn: async (files: FileList) => {
      const imageFiles = Array.from(files)
      const hashes: string[] = []
      // On this way if one of the images fail it will stop execution
      for (const file of imageFiles) {
        try {
          const result = await uploadImage(file)
          hashes.push(result.hash)
        } catch (error) {
          throw error
        }
      }
      return hashes
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
    retry: false,
    ...options,
  })
}
