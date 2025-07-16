import { Image } from '~components/Images/ServerImage'
import { EmpriusLocation } from '~components/Layout/Map/types'
import { LatLng } from 'leaflet'

export interface DateRange {
  from: number
  to: number
}

export type Tool = {
  userId: string
  userActive: boolean
  id: number
  title: string
  description?: string
  cost?: number
  toolValuation?: number
  estimatedDailyCost?: number
  isAvailable?: boolean
  images: Image[]
  toolCategory?: number // Category ID
  rating: number
  height?: number
  weight?: number
  reservedDates: DateRange[] | null
  isNomadic?: boolean
  actualUserId?: string
  actualUserActive?: boolean
  maxDistance?: number
  communities?: string[] // Array of community IDs where this tool is shared
}

export type ToolDetail = {
  location?: LatLng
} & Tool

export type ToolDTO = Omit<Tool, 'location'> & {
  location?: EmpriusLocation
}

export interface ToolsListResponse {
  tools: ToolDTO[]
}

export type CreateToolParams = {
  title: string
  description?: string
  isAvailable?: boolean
  images: string[]
  toolCategory?: number // uint
  location: LatLng
  toolValuation?: number // uint64
  height?: number // uint64
  weight?: number // uint64
  isNomadic?: boolean
  maxDistance?: number
  communities?: string[] // Array of community IDs where this tool is shared
  cost?: number
}

export type UpdateToolParams = CreateToolParams & {
  id: string
}

export type CreateToolDTO = Omit<CreateToolParams, 'location'> & {
  id?: string
  location?: EmpriusLocation
}
