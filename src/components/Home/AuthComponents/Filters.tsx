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
