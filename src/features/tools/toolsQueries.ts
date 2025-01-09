import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { tools } from '~src/services/api'
import { Tool } from '~src/types'

export interface createToolParams {
  title: string
  description: string
  mayBeFree: boolean
  askWithFee: boolean
  cost: number // uint64
  images: string[]
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
