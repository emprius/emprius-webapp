import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { tools } from '~src/services/api'
import { Tool, Image, ImageContent } from '~src/types'

export interface UpdateToolParams {
  id: string
  title?: string
  description?: string
  mayBeFree?: boolean
  askWithFee?: boolean
  cost?: number
  images?: ImageContent[]
  transportOptions?: number[]
  category?: number
  location?: {
    latitude: number
    longitude: number
  }
  estimatedValue?: number
  height?: number
  weight?: number
}

export interface createToolParams {
  title: string
  description: string
  mayBeFree: boolean
  askWithFee: boolean
  cost: number // uint64
  images: ImageContent[]
  transportOptions: number[] // []uint
  category: number // uint
  location: {
    latitude: number // int64
    longitude: number // int64
  }
  estimatedValue: number // uint64
  height: number // uint64
  weight: number // uint64
}

export const useCreateTool = (options?: Omit<UseMutationOptions<Tool, Error, createToolParams>, 'mutationFn'>) =>
  useMutation({
    mutationFn: tools.create,
    ...options,
  })

export const useUpdateTool = (options?: Omit<UseMutationOptions<Tool, Error, UpdateToolParams>, 'mutationFn'>) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateToolParams) => {
      const formData = new FormData()
      
      // Type guard for location object
      const isLocation = (value: any): value is { latitude: number; longitude: number } => {
        return value && typeof value === 'object' && 'latitude' in value && 'longitude' in value
      }

      // Append all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'location' && isLocation(value)) {
            formData.append('latitude', value.latitude.toString())
            formData.append('longitude', value.longitude.toString())
          } else if (Array.isArray(value)) {
            if (key === 'images') {
              (value as ImageContent[]).forEach((image, index) => {
                formData.append(`images[${index}]`, image.content)
                formData.append(`imageHashes[${index}]`, image.hash)
                formData.append(`imageNames[${index}]`, image.name)
              })
            } else if (key === 'transportOptions') {
              value.forEach((option, index) => {
                formData.append(`transportOptions[${index}]`, option.toString())
              })
            }
          } else if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0')
          } else {
            formData.append(key, value.toString())
          }
        }
      })

      const response = await tools.update(id, formData)
      return response
    },
    onSuccess: (data) => {
      // Invalidate tool queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['tools'] })
      queryClient.invalidateQueries({ queryKey: ['tool', data.id.toString()] })
    },
    ...options,
  })
}
