import { EmpriusLocation } from '~components/Layout/Map/types'
import { LatLng } from 'leaflet'

export const getB64FromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result?.toString().split(',')[1]
      if (base64) resolve(base64)
      else reject('Failed to convert image to base64')
    }
    reader.onerror = () => reject('Failed to read file')
    reader.readAsDataURL(file)
  })
}

/**
 * From an emprius location return
 * @param loc
 */
export const toLatLng = (loc: EmpriusLocation): LatLng => new LatLng(loc.latitude / 1e6, loc.longitude / 1e6)
export const toEmpriusLocation = (loc: LatLng): EmpriusLocation => ({
  latitude: Math.round(loc.lat * 1e6),
  longitude: Math.round(loc.lng * 1e6),
})

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @returns Distance in kilometers
 */
export const calculateDistance = ({ lng: lon1, lat: lat1 }: LatLng, { lng: lon2, lat: lat2 }: LatLng): number => {
  const toRad = (value: number) => (value * Math.PI) / 180

  const R = 6371 // Earth radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // distance in kilometers
}
