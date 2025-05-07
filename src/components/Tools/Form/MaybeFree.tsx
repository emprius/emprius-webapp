import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react'
import { lighterText } from '~theme/common'
import { Controller } from 'react-hook-form'
import { ToolFormData } from '~components/Tools/Form'

interface MaybeFreeProps {
  control: any
  setValue: (name: keyof ToolFormData, value: any) => void
  watch: (name: keyof ToolFormData) => any
  errors: any
}

export const MaybeFree: React.FC<MaybeFreeProps> = ({ control, setValue, watch, errors }) => {
  const { t } = useTranslation()
  const [isFree, setIsFree] = useState(false)

  useEffect(() => {
    // Check initial value and set switch state
    const value = watch('estimatedValue')
    if (value === 0) {
      setIsFree(true)
    }
  }, [])

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsFree(checked)
    if (checked) {
      setValue('estimatedValue', 0)
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align='start'>
        <FormControl display='flex' flexDirection={'column'} alignItems='start' width='auto' gap={1}>
          <FormLabel htmlFor='isFree' mr={3}>
            {t('tools.is_free')}
          </FormLabel>
          <Text fontSize='sm' sx={lighterText}>
            {t('tools.tool_is_free_description', {
              defaultValue: 'No cost associated for loan the tool',
            })}
          </Text>
          <Switch mt={4} id='isFree' isChecked={isFree} onChange={handleSwitchChange} size={'lg'} />
        </FormControl>
        <FormControl flex={1} isDisabled={isFree} isInvalid={!!errors.estimatedValue} isRequired={!isFree}>
          <FormLabel>{t('tools.estimated_value', { defaultValue: 'Estimated Value' })}</FormLabel>
          <Text fontSize='sm' sx={lighterText}>
            {t('tools.tool_estimated_value_description', {
              defaultValue:
                'Set the estimated value of your tool. If the tool is not free, this value will be used to calculate the cost per day.',
            })}
          </Text>
          <Controller
            name='estimatedValue'
            control={control}
            rules={{
              validate: (value) => {
                if (!isFree && (!value || value <= 0)) {
                  return t('tools.value_must_be_greater_than_zero', { defaultValue: 'Value must be greater than 0' })
                }
                return true
              },
            }}
            render={({ field }) => (
              <NumberInput min={0} precision={0} isDisabled={isFree} {...field}>
                <NumberInputField placeholder={t('tools.enter_estimated_value')} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <FormErrorMessage>{errors.estimatedValue?.message}</FormErrorMessage>
        </FormControl>
      </Stack>
    </Stack>
  )
}
