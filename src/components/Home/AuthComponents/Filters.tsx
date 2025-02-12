import { FormControl } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useInfoContext } from '~components/InfoProviders/InfoContext'
import { SearchParams } from '~components/Search/queries'

type FiltersProps = {
  setFilters: (value: SearchParams) => void
  filters: SearchParams
}

export const TransportFilter = ({ filters, setFilters }: FiltersProps) => {
  const { t } = useTranslation()
  const { transports } = useInfoContext()

  const handleTransportChange = (newValue: any) => {
    if (!newValue) {
      setFilters({ ...filters, transportOptions: undefined })
      return
    }
    const transportIds = newValue.map((item: any) => parseInt(item.value))
    setFilters({ ...filters, transportOptions: transportIds })
  }

  return (
    <FormControl>
      <Select
        isMulti
        value={filters.transportOptions?.map((id: number) => ({
          value: id,
          label: transports.find((t) => t.id === id)?.name,
        }))}
        onChange={handleTransportChange}
        options={transports.map((transport) => ({
          value: transport.id,
          label: transport.name,
        }))}
        placeholder={t('tools.select_transport', { defaultValue: 'Select transport' })}
      />
    </FormControl>
  )
}
export const CategoryFilter = ({ filters, setFilters }: FiltersProps) => {
  const { t } = useTranslation()
  const { categories } = useInfoContext()

  const handleCategoryChange = (newValue: any) => {
    if (!newValue) {
      setFilters({ ...filters, categories: undefined })
      return
    }
    const categoryIds = newValue.map((item: any) => parseInt(item.value))
    setFilters({ ...filters, categories: categoryIds })
  }

  return (
    <FormControl>
      <Select
        isMulti
        value={filters.categories?.map((id: number) => ({
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
  )
}
