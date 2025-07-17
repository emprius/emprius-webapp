import { LocationPicker } from '~components/Layout/Map/LocationPicker'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { ToolFormData } from '~components/Tools/Form'
import { useTranslation } from 'react-i18next'
import { Button, VStack } from '@chakra-ui/react'
import { icons } from '~theme/icons'
import { useAuth } from '~components/Auth/AuthContext'
import { deepEqual } from '~utils/compare'

const EditToolLocation = () => {
  const { t } = useTranslation()
  const { control, watch, setValue } = useFormContext<ToolFormData>()
  const {
    user: { location: userLocation },
  } = useAuth()

  const isNomadic = watch('isNomadic')
  const location = watch('location')

  const isAtHome = deepEqual(userLocation, location)

  let helperText = t('tools.map_description', {
    defaultValue: 'You can edit the location of your tool on the map below if is not at your current location.',
  })
  if (isNomadic) {
    helperText = t('tools.nomadic_map_description', {
      defaultValue: 'Nomadic tools automatically update their location when a user moves or picks them up.',
    })
  }

  let isAtHomeText = t('tools.tool_at_home_btn', {
    defaultValue: 'Set user position as tool location',
  })
  if (isAtHome) {
    isAtHomeText = t('tools.tool_is_at_home_btn', {
      defaultValue: 'Tool is already at your location',
    })
  }

  return (
    <VStack>
      <LocationPicker
        name='location'
        control={control}
        isRequired={true}
        helperText={helperText}
        canEdit={!isNomadic}
      />
      {!isNomadic && (
        <Button
          leftIcon={icons.userHome({})}
          disabled={isAtHome}
          onClick={() => {
            setValue('location', userLocation)
          }}
        >
          {isAtHomeText}
        </Button>
      )}
    </VStack>
  )
}

export default EditToolLocation
