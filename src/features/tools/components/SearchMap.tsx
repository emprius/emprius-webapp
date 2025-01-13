import { Box } from '@chakra-ui/react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { Tool } from '~src/types'
import { ToolTooltip } from './ToolTooltip'
import { MAP_DEFAULTS } from '~constants'

// Set up default marker icon
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

export interface SearchMapProps {
  tools: Tool[]
  onLocationSelect: (location: { lat: number; lng: number }) => void
  onToolSelect: (toolId: string) => void
  center?: { lat: number; lng: number }
}

// Component to handle map events and center updates
const MapController = ({
  onLocationSelect,
  center,
}: {
  onLocationSelect: (location: { lat: number; lng: number }) => void
  center?: { lat: number; lng: number }
}) => {
  const map = useMap()

  useMapEvents({
    click: (e) => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], map.getZoom(), {
        duration: 1.5,
      })
    }
  }, [center, map])

  return null
}

export const SearchMap = ({ tools, onLocationSelect, onToolSelect, center }: SearchMapProps) => {
  return (
    <Box height='100%' width='100%'>
      <MapContainer
        center={center || MAP_DEFAULTS.CENTER}
        zoom={MAP_DEFAULTS.ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        minZoom={MAP_DEFAULTS.MIN_ZOOM}
        maxZoom={MAP_DEFAULTS.MAX_ZOOM}
      >
        <TileLayer
          attribution={MAP_DEFAULTS.TILE_LAYER.ATTRIBUTION}
          url={MAP_DEFAULTS.TILE_LAYER.URL}
        />
        <MapController onLocationSelect={onLocationSelect} center={center} />
        {tools.map(
          (tool) =>
            tool.location && (
              <Marker
                key={tool.id}
                position={[tool.location.latitude / 1e6, tool.location.longitude / 1e6]}
              >
                <Popup>
                  <ToolTooltip tool={tool} onSelect={onToolSelect} />
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </Box>
  )
}
