import { Image } from '~components/Images/ServerImage'
import { DateRange } from '~components/Layout/Form/DateRangePicker'
import { EmpriusLocation } from '~components/Layout/Map/types'

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
}
