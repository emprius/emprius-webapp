import { EmpriusLocation } from '~components/Layout/types'
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
