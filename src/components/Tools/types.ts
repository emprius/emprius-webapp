import { Image } from '~components/Images/ServerImage'
import { EmpriusLocation } from '~components/Layout/Map/types'

export interface DateRange {
  from: number
  to: number
}

export interface Tool {
  userId: string
  id: number
  title: string
  description?: string
  cost?: number
  isAvailable?: boolean
  images: Image[]
  toolCategory?: number // Category ID
  location?: EmpriusLocation
  rating: number
  estimatedValue?: number
  height?: number
  weight?: number
  reservedDates: DateRange[] | null
  communities?: string[] // Array of community IDs where this tool is shared
}

export interface ToolsListResponse {
  tools: Tool[]
}

export interface ToolFormData {
  id?: number
  title: string
  description: string
  cost: number
  isAvailable: boolean
  images: FileList
  toolCategory?: number
  location?: EmpriusLocation
  estimatedValue: number
  height: number
  weight: number
  communities?: string[] // Array of community IDs where this tool is shared
}
