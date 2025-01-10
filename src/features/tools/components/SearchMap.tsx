import React, { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { Tool } from '~src/types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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
        attribution: '© OpenStreetMap contributors'
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
      tools.forEach(tool => {
        if (tool.location) {
          const marker = L.marker([tool.location.latitude / 1e6, tool.location.longitude / 1e6])
            .bindPopup(`
              <div>
                <h3>${tool.title}</h3>
                <p>${tool.description}</p>
                <button onclick="window.handleToolSelect('${tool.id}')">View Details</button>
              </div>
            `)
          marker.addTo(markersRef.current!)
        }
      })
    }

    // Add global handler for tool selection from popup
    window.handleToolSelect = (toolId: string) => {
      onToolSelect(toolId)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      delete window.handleToolSelect
    }
  }, [tools, center, onLocationSelect, onToolSelect])

  return (
    <Box id="map" height="100%" width="100%" />
  )
}

// Add type declaration for the global function
declare global {
  interface Window {
    handleToolSelect: (toolId: string) => void
  }
}
