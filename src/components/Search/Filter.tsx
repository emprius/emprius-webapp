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
import React, { useCallback, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useInfoContext } from '~components/Layout/Contexts/InfoContext'
import {
  DISTANCE_DEFAULT,
  DISTANCE_MAX,
  MAX_COST_DEFAULT,
  MAX_COST_MAX,
  useSearch,
} from '~components/Search/SearchContext'
import { SearchParams } from '~components/Search/queries'

interface FilterMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const FiltersDrawer = ({ isOpen, onClose }: FilterMenuProps) => {
  const { handleSubmit } = useFormContext()
  const { t } = useTranslation()
  const { filters, setFilters } = useSearch()

  const onSubmit = (data: SearchParams) => {
    setFilters({ ...filters, ...data })
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

export const FiltersForm = React.memo(() => {
  const { t } = useTranslation()
  const { categories } = useInfoContext()
  const { setValue, watch } = useFormContext<SearchParams>()

  // Memoize category change handler to prevent re-creation on every render
  const handleCategoryChange = useCallback(
    (newValue: any) => {
      if (!newValue) {
        setValue('categories', undefined)
        return
      }
      const categoryIds = newValue.map((item: any) => parseInt(item.value))
      setValue('categories', categoryIds)
    },
    [setValue]
  )

  // Memoize category options to prevent re-creation on every render
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  )

  // Memoize category values to prevent re-creation on every render
  const categoryValues = useMemo(
    () =>
      watch('categories')?.map((id: number) => ({
        value: id,
        label: categories.find((c) => c.id === id)?.name,
      })),
    [watch('categories'), categories]
  )

  return (
    <Stack spacing={6} pb={6}>
      <DistanceController />
      <MaxCostController />

      <FormControl>
        <FormLabel>{t('search.category')}</FormLabel>
        <Select
          isMulti
          value={categoryValues}
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder={t('tools.select_category', { defaultValue: 'Select category' })}
        />
      </FormControl>
    </Stack>
  )
})

FiltersForm.displayName = 'FiltersForm'

// Memoized distance controller component to prevent re-renders
const DistanceController = React.memo(() => {
  const { t } = useTranslation()

  return (
    <Controller
      name='distance'
      defaultValue={DISTANCE_DEFAULT}
      render={({ field }) => (
        <FormControl>
          <FormLabel>{t('search.distance')} (km)</FormLabel>
          <HStack spacing={4}>
            <Slider
              flex='1'
              min={1}
              max={DISTANCE_MAX}
              step={1}
              value={field.value || DISTANCE_DEFAULT}
              onChange={field.onChange}
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
              value={field.value || DISTANCE_DEFAULT}
              onChange={(_, value) => field.onChange(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </FormControl>
      )}
    />
  )
})

DistanceController.displayName = 'DistanceController'

// Memoized max cost controller component to prevent re-renders
const MaxCostController = React.memo(() => {
  const { t } = useTranslation()

  return (
    <Controller
      name='maxCost'
      defaultValue={MAX_COST_DEFAULT}
      render={({ field }) => (
        <FormControl>
          <FormLabel>
            {t('search.max_cost')} ({t('common.token_symbol')})
          </FormLabel>
          <HStack spacing={4}>
            <Slider
              flex='1'
              min={0}
              max={MAX_COST_MAX}
              step={10}
              value={field.value || MAX_COST_DEFAULT}
              onChange={field.onChange}
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
              value={field.value || MAX_COST_DEFAULT}
              onChange={(_, value) => field.onChange(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </FormControl>
      )}
    />
  )
})

MaxCostController.displayName = 'MaxCostController'
