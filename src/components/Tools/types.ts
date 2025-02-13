import { Image } from '~components/Images/ServerImage'
import { DateRange } from '~components/Layout/Form/DateRangePicker'
import { EmpriusLocation } from '~components/Layout/types'

export interface Tool {
  id: number
  title: string
  description?: string
  isAvailable?: boolean
  cost?: number
  userId: string
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
  title: string
  description: string
  cost: number
  toolCategory?: number
  estimatedValue: number
  height: number
  weight: number
  images: FileList | any[]
  location?: EmpriusLocation
  isAvailable: boolean
}
