import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L, { LatLng } from 'leaflet'
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'react-i18next'
import './LocationPicker.css'
import { MAP_DEFAULTS } from '~constants'

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface LocationPickerProps {
  onChange: (location: { latitude: number; longitude: number } | null) => void
  value?: { latitude: number; longitude: number } | null
  isRequired?: boolean
  error?: string
}

// Component to handle map clicks and movement
const MapController = ({
  onLocationSelect,
  position,
}: {
  onLocationSelect: (latLng: LatLng) => void
  position: LatLng | null
}) => {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), {
        duration: 1.5,
      })
    }
  }, [position, map])

  useEffect(() => {
    map.on('click', (e) => {
      onLocationSelect(e.latlng)
    })
    return () => {
      map.off('click')
    }
  }, [map, onLocationSelect])

  return null
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onChange, value, isRequired = false, error }) => {
  const { t } = useTranslation()
  const [position, setPosition] = useState<LatLng | null>(value ? new LatLng(value.latitude, value.longitude) : null)

  const handleLocationSelect = (latLng: LatLng) => {
    setPosition(latLng)
    onChange({
      latitude: latLng.lat,
      longitude: latLng.lng,
    })
  }

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      <FormLabel>{t('common.location')}</FormLabel>
      <div className='map-container'>
        <MapContainer
          center={new LatLng(MAP_DEFAULTS.CENTER.lat, MAP_DEFAULTS.CENTER.lng)}
          zoom={MAP_DEFAULTS.ZOOM}
          scrollWheelZoom={true}
          minZoom={MAP_DEFAULTS.MIN_ZOOM}
          maxZoom={MAP_DEFAULTS.MAX_ZOOM}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <MapController onLocationSelect={handleLocationSelect} position={position} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
