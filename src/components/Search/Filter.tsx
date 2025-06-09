import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useInfoContext } from '~components/Layout/Contexts/InfoContext'
import {
  DISTANCE_DEFAULT,
  DISTANCE_MAX,
  MAX_COST_DEFAULT,
  MAX_COST_MAX,
  SearchFilters,
  useSearch,
} from '~components/Search/SearchContext'

interface FilterMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const FiltersDrawer = ({ isOpen, onClose }: FilterMenuProps) => {
  const { handleSubmit } = useFormContext()
  const { t } = useTranslation()
  const { filters, setFilters, setFiltersWithURLUpdate } = useSearch()

  const onSubmit = (data: SearchFilters) => {
    setFiltersWithURLUpdate({ ...filters, ...data })
    // if (setFiltersWithURLUpdate) {
    //   setFiltersWithURLUpdate({ ...filters, ...data })
    // } else {
    //   setFilters({ ...filters, ...data })
    // }
  }

  return (
    <Drawer isOpen={isOpen} placement='bottom' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent borderTopRadius='lg'>
        <DrawerCloseButton />
        <DrawerHeader>{t('search.filters')}</DrawerHeader>
        <DrawerBody>
          <FiltersForm />
          <HStack>
            <Button size='lg' onClick={onClose} mt={4} w='full'>
              {t('common.close')}
            </Button>
            <Button size='lg' onClick={() => handleSubmit(onSubmit)()} mt={4} w='full'>
              {t('search.apply_filters')}
            </Button>
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export const FiltersForm = () => {
  const { t } = useTranslation()
  const { categories } = useInfoContext()
  const { setValue, watch } = useFormContext<SearchFilters>()

  const handleCategoryChange = (newValue: any) => {
    if (!newValue) {
      setValue('categories', undefined)
      return
    }
    const categoryIds = newValue.map((item: any) => parseInt(item.value))
    setValue('categories', categoryIds)
  }

  const handleDistanceChange = (value: number) => {
    setValue('distance', value)
  }

  const handleMaxCostChange = (value: number) => {
    setValue('maxCost', value)
  }

  return (
    <Stack spacing={6} pb={6}>
      <FormControl>
        <FormLabel>{t('search.distance')} (km)</FormLabel>
        <HStack spacing={4}>
          <Slider
            flex='1'
            defaultValue={DISTANCE_DEFAULT}
            min={1}
            max={DISTANCE_MAX}
            step={1}
            value={watch('distance')}
            onChange={handleDistanceChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <NumberInput
            maxW='100px'
            min={1}
            max={DISTANCE_MAX}
            step={1}
            value={watch('distance') || DISTANCE_MAX}
            onChange={(_, value) => handleDistanceChange(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </FormControl>

      <FormControl>
        <FormLabel>
          {t('search.max_cost')} ({t('common.token_symbol')})
        </FormLabel>
        <HStack spacing={4}>
          <Slider
            flex='1'
            defaultValue={MAX_COST_DEFAULT}
            min={0}
            max={MAX_COST_MAX}
            step={10}
            value={watch('maxCost') || 0}
            onChange={handleMaxCostChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <NumberInput
            maxW='100px'
            min={0}
            max={MAX_COST_MAX}
            step={10}
            value={watch('maxCost') || 0}
            onChange={(_, value) => handleMaxCostChange(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
      </FormControl>

      <FormControl>
        <FormLabel>{t('search.category')}</FormLabel>
        <Select
          isMulti
          value={watch('categories')?.map((id: number) => ({
            value: id,
            label: categories.find((c) => c.id === id)?.name,
          }))}
          onChange={handleCategoryChange}
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          placeholder={t('tools.select_category', { defaultValue: 'Select category' })}
        />
      </FormControl>
    </Stack>
  )
}
