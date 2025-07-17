import { FormControl, FormLabel, Icon, Switch, Text } from '@chakra-ui/react'
import { icons } from '~theme/icons'
import { FormHelperText } from '@chakra-ui/icons'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { ToolFormData } from '~components/Tools/Form'
import { useTranslation } from 'react-i18next'
import { useAuth } from '~components/Auth/AuthContext'

const IsNomadic = ({ isNomadicChangeDisabled }: { isNomadicChangeDisabled: boolean }) => {
  const { t } = useTranslation()
  const { setValue, watch } = useFormContext<ToolFormData>()
  const {
    user: { location },
  } = useAuth()

  const isNomadic = watch('isNomadic')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    setValue('isNomadic', newValue)
    setValue('location', location)
  }

  return (
    <FormControl
      display='flex'
      flexDirection={'column'}
      alignItems='start'
      justifyContent={{ base: 'start', md: 'end' }}
    >
      <FormLabel mb='0'>
        <Icon as={icons.nomadic} mr={2} />
        {t('tools.nomadic', { defaultValue: 'Nomadic' })}
      </FormLabel>
      <Text fontSize='sm' color='lighterText'>
        {t('tools.nomadic_description', {
          defaultValue:
            'Tools change location every time they are rented. Once rented, they stay at the new location until rented again.',
        })}
      </Text>
      <Switch mt={2} size='lg' isChecked={isNomadic} onChange={handleChange} disabled={isNomadicChangeDisabled} />{' '}
      {isNomadicChangeDisabled && (
        <FormHelperText>
          {t('tools.nomadic_change_disabled', {
            defaultValue:
              "You can't change this option until the tool is back with you. Create and pick booking to get it back to your location",
          })}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default IsNomadic
