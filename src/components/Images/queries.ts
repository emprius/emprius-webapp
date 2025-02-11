import { useMutation } from '@tanstack/react-query'
import api from '~src/services/api'
import { getB64FromFile } from '~src/utils'

export const useUploadImage = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const base64 = await getB64FromFile(file)
      return api.images.uploadImage(base64)
    },
  })
