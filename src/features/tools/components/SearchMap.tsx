import React, { useCallback } from 'react';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Tool } from '../../../types';

interface IconDefault extends L.Icon {
  _getIconUrl?: string;
}

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as IconDefault)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SearchMapProps {
  tools: Tool[];
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

// Component to handle map events and updates
const MapEvents = ({ onLocationSelect }: { onLocationSelect?: (location: { lat: number; lng: number }) => void }) => {
  const map = useMap();

  map.on('click', (e) => {
    onLocationSelect?.({ lat: e.latlng.lat, lng: e.latlng.lng });
  });

  return null;
};

export const SearchMap = ({
  tools,
  onLocationSelect,
  center = { lat: 41.3851, lng: 2.1734 }, // Barcelona by default
  zoom = 12,
}: SearchMapProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const handleMyLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onLocationSelect?.(location);
        },
        () => {
          toast({
            title: t('error.geolocation'),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      );
    }
  }, [onLocationSelect, toast, t]);

  return (
    <Box position="relative" h="500px">
      <Stack
        position="absolute"
        top={4}
        left={4}
        right={4}
        zIndex={1000}
        spacing={2}
      >
        <InputGroup>
          <InputLeftElement>
            <FiSearch />
          </InputLeftElement>
          <Input
            placeholder={t('search.location')}
            bg="white"
            _dark={{ bg: 'gray.800' }}
          />
        </InputGroup>
        <Button
          leftIcon={<FiMapPin />}
          onClick={handleMyLocation}
          w="fit-content"
        >
          {t('search.myLocation')}
        </Button>
      </Stack>

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onLocationSelect={onLocationSelect} />
        {tools.map((tool) => (
          <Marker
            key={tool.id}
            position={[tool.location.lat, tool.location.lng]}
            eventHandlers={{
              click: () => navigate(`/tools/${tool.id}`),
            }}
          >
            <Popup>
              <div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{tool.name}</h3>
                <p style={{ marginBottom: '4px' }}>{tool.price}€/day</p>
                <p style={{ color: tool.status === 'available' ? 'green' : 'gray' }}>
                  {tool.status === 'available' ? 'Available' : 'Unavailable'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};
