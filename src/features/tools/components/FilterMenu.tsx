import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SearchFilters } from '../searchQueries'

interface FilterMenuProps {
  isOpen: boolean
  onClose: () => void
  filters: Partial<SearchFilters>
  onFiltersChange: (filters: Partial<SearchFilters>) => void
}

const categories = [
  { id: 0, key: 'power_tools' },
  { id: 1, key: 'hand_tools' },
  { id: 2, key: 'garden_tools' },
  { id: 3, key: 'construction' },
  { id: 4, key: 'automotive' },
  { id: 5, key: 'cleaning' },
  { id: 6, key: 'other' },
]

export const FilterMenu = ({ isOpen, onClose, filters, onFiltersChange }: FilterMenuProps) => {
  const { t } = useTranslation()

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value)
    onFiltersChange({
      ...filters,
      categories: categoryId >= 0 ? [categoryId] : undefined,
    })
  }

  const handleDistanceChange = (value: number) => {
    onFiltersChange({
      ...filters,
      distance: value,
    })
  }

  const handleMaxCostChange = (value: number) => {
    onFiltersChange({
      ...filters,
      maxCost: value,
    })
  }

  const handleMayBeFreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      mayBeFree: e.target.checked,
    })
  }

  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent borderTopRadius="lg">
        <DrawerCloseButton />
        <DrawerHeader>{t('search.filters')}</DrawerHeader>

        <DrawerBody>
          <Stack spacing={6} pb={6}>
            <FormControl>
              <FormLabel>{t('search.category')}</FormLabel>
              <Select
                value={filters.categories?.[0] ?? ''}
                onChange={handleCategoryChange}
              >
                <option value="">{t('search.allCategories')}</option>
                {categories.map(({ id, key }) => (
                  <option key={key} value={id}>
                    {t(`categories.${key}`)}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>{t('search.distance')} ({filters.distance || 10}km)</FormLabel>
              <Slider
                defaultValue={10}
                min={1}
                max={50}
                step={1}
                value={filters.distance || 10}
                onChange={handleDistanceChange}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl>
              <FormLabel>{t('search.maxCost')} ({filters.maxCost || 0}€)</FormLabel>
              <Slider
                defaultValue={0}
                min={0}
                max={1000}
                step={10}
                value={filters.maxCost || 0}
                onChange={handleMaxCostChange}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>{t('search.mayBeFree')}</FormLabel>
              <Switch
                isChecked={filters.mayBeFree}
                onChange={handleMayBeFreeChange}
              />
            </FormControl>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
