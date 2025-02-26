import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import L, { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { MAP_DEFAULTS } from '~utils/constants'
import { EmpriusMarker } from '~components/Layout/Map/Map'
import { toLatLng } from '~src/utils'

L.Marker.prototype.options.icon = MAP_DEFAULTS.MARKER

interface LocationPickerProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  isRequired?: boolean
  rules?: Record<string, any>
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

export const LocationPicker = <T extends FieldValues>({
  name,
  control,
  isRequired = false,
  rules,
}: LocationPickerProps<T>) => {
  const { t } = useTranslation()

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: isRequired && t('common.required'),
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const [position, setPosition] = useState<LatLng | null>(value ? toLatLng(value) : null)

        const handleLocationSelect = (latLng: LatLng) => {
          setPosition(latLng)
          onChange({
            latitude: Math.round(latLng.lat * 1000000),
            longitude: Math.round(latLng.lng * 1000000),
          })
        }

        return (
          <FormControl isRequired={isRequired} isInvalid={!!error}>
            <FormLabel>{t('common.location')}</FormLabel>
            <div className='map-container'>
              <MapContainer
                center={position || MAP_DEFAULTS.CENTER}
                zoom={MAP_DEFAULTS.ZOOM}
                scrollWheelZoom={true}
                minZoom={MAP_DEFAULTS.MIN_ZOOM}
                maxZoom={MAP_DEFAULTS.MAX_ZOOM}
              >
                <TileLayer attribution={MAP_DEFAULTS.TILE_LAYER.ATTRIBUTION} url={MAP_DEFAULTS.TILE_LAYER.URL} />
                <MapController onLocationSelect={handleLocationSelect} position={position} />
                {position && <EmpriusMarker position={position} />}
              </MapContainer>
            </div>
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>
        )
      }}
    />
  )
}
