import { LocationPicker } from '~components/Layout/Map/LocationPicker'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { ToolFormData } from '~components/Tools/Form'
import { useTranslation } from 'react-i18next'

const EditToolLocation = () => {
  const { t } = useTranslation()
  const { control, watch } = useFormContext<ToolFormData>()

  const isNomadic = watch('isNomadic')

  let helperText = t('tools.map_description', {
    defaultValue: 'You can edit the location of your tool on the map below if is not at your current location.',
  })
  if (isNomadic) {
    helperText = t('tools.nomadic_map_description', {
      defaultValue: 'Nomadic tools automatically update their location when a user moves or picks them up.',
    })
  }

  return (
    <>
      <LocationPicker
        name='location'
        control={control}
        isRequired={true}
        helperText={helperText}
        canEdit={!isNomadic}
      />
    </>
  )
}

export default EditToolLocation
