import { useMutation, useQuery } from '@tanstack/react-query'
import { ImageContent } from '~components/Images/ServerImage'
import api from '~src/services/api'
import { getB64FromFile } from '~src/utils'

export const useImage = (imageId?: string) =>
  useQuery<ImageContent>({
    queryKey: ['image', imageId],
    queryFn: () => api.images.getImage(imageId!),
    enabled: !!imageId,
  })

export const useUploadImage = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const base64 = await getB64FromFile(file)
      return api.images.uploadImage(base64)
    },
  })
