import { Box } from '@chakra-ui/react'
import L, { LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { MAP_DEFAULTS } from '~utils/constants'
import { ToolTooltip } from './ToolTooltip'
import { Tool } from '~components/Tools/types'
import { EmpriusLocation } from '~components/Layout/types'
import { useTranslation } from 'react-i18next'
import ReactDOMServer from 'react-dom/server'
import { IoMdHome } from 'react-icons/io'

const HomeIcon = L.divIcon({
  className: 'custom-home-marker',
  html: ReactDOMServer.renderToString(
    <IoMdHome style={{ color: '#0967D2', fontSize: '52px', filter: 'drop-shadow(3px 3px 4px #0967D2)' }} />
  ),
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -35],
})

export interface SearchMapProps {
  tools: Tool[]
  center: EmpriusLocation
}

export const SearchMap = ({ tools, center: { latitude, longitude } }: SearchMapProps) => {
  const latlng = new LatLng(latitude / 1000000, longitude / 1000000)
  const { t } = useTranslation()

  return (
    <Box
      height='100%'
      width='100%'
      sx={{
        '.custom-home-marker': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'none',
          border: 'none',
        },
      }}
    >
      <MapContainer
        center={latlng || MAP_DEFAULTS.CENTER}
        zoom={MAP_DEFAULTS.ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        minZoom={MAP_DEFAULTS.MIN_ZOOM}
        maxZoom={MAP_DEFAULTS.MAX_ZOOM}
      >
        <TileLayer attribution={MAP_DEFAULTS.TILE_LAYER.ATTRIBUTION} url={MAP_DEFAULTS.TILE_LAYER.URL} />
        <Marker position={latlng} icon={HomeIcon}>
          <Popup>{t('map.you_are_here', { defaultValue: 'You are here' })}</Popup>
        </Marker>
        {tools.map(
          (tool) =>
            tool.location && (
              <Marker key={tool.id} position={[tool.location.latitude / 1e6, tool.location.longitude / 1e6]}>
                <Popup>
                  <ToolTooltip tool={tool} />
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </Box>
  )
}
