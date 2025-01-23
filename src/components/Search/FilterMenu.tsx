import React from 'react'
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
  Switch,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import { useInfoContext } from '~components/Auth/InfoContext'
import { Select } from 'chakra-react-select'

interface FilterMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MAX_COST_MAX = 1000
const MAX_COST_DEFAULT = MAX_COST_MAX
const DISTANCE_MAX = 250
const DISTANCE_DEFAULT = 50

export const FilterMenu = ({ isOpen, onClose }: FilterMenuProps) => {
  const { categories, transports } = useInfoContext()
  const { t } = useTranslation()
  const { setValue, watch } = useFormContext()

  const handleCategoryChange = (newValue: any) => {
    if (!newValue) {
      setValue('categories', undefined)
      return
    }
    const categoryIds = newValue.map((item: any) => parseInt(item.value))
    setValue('categories', categoryIds)
  }

  const handleTransportChange = (newValue: any) => {
    if (!newValue) {
      setValue('transports', undefined)
      return
    }
    const transportIds = newValue.map((item: any) => parseInt(item.value))
    setValue('transports', transportIds)
  }

  const handleDistanceChange = (value: number) => {
    setValue('distance', value)
  }

  const handleMaxCostChange = (value: number) => {
    setValue('maxCost', value)
  }

  const handleMayBeFreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('mayBeFree', e.target.checked)
  }

  return (
    <Drawer isOpen={isOpen} placement='bottom' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent borderTopRadius='lg'>
        <DrawerCloseButton />
        <DrawerHeader>{t('search.filters')}</DrawerHeader>

        <DrawerBody>
          <Stack spacing={6} pb={6}>
            <FormControl display='flex' alignItems='center'>
              <FormLabel mb={0}>{t('search.mayBeFree')}</FormLabel>
              <Switch isChecked={watch('mayBeFree')} onChange={handleMayBeFreeChange} />
            </FormControl>

            <FormControl>
              <FormLabel>{t('search.distance')} (km)</FormLabel>
              <HStack spacing={4}>
                <Slider
                  flex='1'
                  defaultValue={DISTANCE_DEFAULT}
                  min={1}
                  max={DISTANCE_MAX}
                  step={1}
                  value={watch('distance') || 10}
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
                  value={watch('distance') || 10}
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
              <FormLabel>{t('search.maxCost')} (€)</FormLabel>
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
              <FormLabel>{t('search.transport')}</FormLabel>
              <Select
                isMulti
                value={watch('transports')?.map((id: number) => ({
                  value: id,
                  label: transports.find((t) => t.id === id)?.name,
                }))}
                onChange={handleTransportChange}
                options={transports.map((transport) => ({
                  value: transport.id,
                  label: transport.name,
                }))}
                placeholder={t('tools.selectTransport', { defaultValue: 'Select transport' })}
              />
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
                placeholder={t('tools.selectCategory', { defaultValue: 'Select category' })}
              />
            </FormControl>
          </Stack>
          <Button colorScheme='blue' size='lg' onClick={onClose} mt={4} w='full'>
            {t('common.close')}
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
