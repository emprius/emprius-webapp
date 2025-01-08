import React, { useState } from 'react';
import {
  Container,
  Grid,
  GridItem,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useTools } from '../../../hooks/queries';
import { SearchMap } from '../components/SearchMap';
import { ToolCard } from '../components/ToolCard';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

const categories = [
  'power_tools',
  'hand_tools',
  'garden_tools',
  'construction',
  'automotive',
  'cleaning',
  'other',
];

export const SearchPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<SearchFilters>({});
  const { data: toolsResponse, isLoading } = useTools(filters);
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setFilters((prev) => ({
      ...prev,
      location: {
        ...location,
        radius: prev.location?.radius || 10, // Default 10km radius
      },
    }));
  };

  const handleRadiusChange = ([radius]: number[]) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location
        ? {
            ...prev.location,
            radius,
          }
        : undefined,
    }));
  };

  const handlePriceChange = ([minPrice, maxPrice]: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
    }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const tools = toolsResponse?.data || [];

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={8}>
        <GridItem>
          <Stack
            spacing={6}
            position="sticky"
            top="20px"
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
          >
            <FormControl>
              <FormLabel>{t('search.query')}</FormLabel>
              <Input
                value={filters.query || ''}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, query: e.target.value }))
                }
                placeholder={t('search.queryPlaceholder')}
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t('search.category')}</FormLabel>
              <Select
                value={filters.category || ''}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">{t('search.allCategories')}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {t(`categories.${category}`)}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>{t('search.priceRange')}</FormLabel>
              <RangeSlider
                defaultValue={[0, 100]}
                min={0}
                max={100}
                step={5}
                onChange={handlePriceChange}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
              <Text fontSize="sm" color="gray.600" mt={2}>
                {filters.minPrice || 0}€ - {filters.maxPrice || 100}€
              </Text>
            </FormControl>

            {filters.location && (
              <FormControl>
                <FormLabel>{t('search.radius')}</FormLabel>
                <RangeSlider
                  defaultValue={[10]}
                  min={1}
                  max={50}
                  step={1}
                  onChange={handleRadiusChange}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                </RangeSlider>
                <Text fontSize="sm" color="gray.600" mt={2}>
                  {filters.location.radius}km
                </Text>
              </FormControl>
            )}
          </Stack>
        </GridItem>

        <GridItem>
          <Stack spacing={8}>
            <SearchMap
              tools={tools}
              onLocationSelect={handleLocationSelect}
              center={filters.location}
            />

            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                xl: 'repeat(3, 1fr)',
              }}
              gap={6}
            >
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </Grid>
          </Stack>
        </GridItem>
      </Grid>
    </Container>
  );
};
