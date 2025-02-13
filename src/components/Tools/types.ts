import { Image } from '~components/Images/ServerImage'
import { DateRange } from '~components/Layout/Form/DateRangePicker'
import { EmpriusLocation } from '~components/Layout/types'

export interface Tool {
  id: number
  title: string
  description?: string
  isAvailable?: boolean
  mayBeFree: boolean
  askWithFee: boolean
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
