import { Box } from '@chakra-ui/react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Tool } from '~src/types'
import { ToolTooltip } from './ToolTooltip'

export interface SearchMapProps {
  tools: Tool[]
  onLocationSelect: (location: { lat: number; lng: number }) => void
  onToolSelect: (toolId: string) => void
  center?: { lat: number; lng: number }
}

export const SearchMap = ({ tools, onLocationSelect, onToolSelect, center }: SearchMapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map('map').setView([41.3851, 2.1734], 13) // Default to Barcelona
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current)

      // Initialize markers layer group
      markersRef.current = L.layerGroup().addTo(mapRef.current)

      // Add click handler for location selection
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
      })
    }

    // Update center if provided
    if (center && mapRef.current) {
      mapRef.current.setView([center.lat, center.lng], 13)
    }

    // Update markers
    if (markersRef.current) {
      markersRef.current.clearLayers()
      tools.forEach((tool) => {
        if (tool.location) {
          const marker = L.marker([tool.location.latitude / 1e6, tool.location.longitude / 1e6])
          const popupContent = document.createElement('div')
          const popup = L.popup().setContent(popupContent)
          marker.bindPopup(popup)

          // Render React component when popup opens
          marker.on('popupopen', () => {
            ReactDOM.render(<ToolTooltip tool={tool} onSelect={onToolSelect} />, popupContent)
          })

          // Cleanup when popup closes
          marker.on('popupclose', () => {
            ReactDOM.unmountComponentAtNode(popupContent)
          })

          marker.addTo(markersRef.current!)
        }
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [tools, center, onLocationSelect, onToolSelect])

  return <Box id='map' height='100%' width='100%' />
}
