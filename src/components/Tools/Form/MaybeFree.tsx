import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  AlertIcon,
  Collapse,
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
} from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { ToolFormData } from '~components/Tools/Form'
import { FormHelperText } from '@chakra-ui/icons'

interface MaybeFreeProps {
  estimatedDailyCost: number
  cost: number
}

export const MaybeFree: React.FC<MaybeFreeProps> = ({ estimatedDailyCost, cost }) => {
  const { t } = useTranslation()
  const [isFree, setIsFree] = useState(false)
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ToolFormData>()

  const isNomadic = watch('isNomadic')

  useEffect(() => {
    // Check initial value and set switch state
    const value = watch('toolValuation')
    if (value === 0) {
      setIsFree(true)
    }
  }, [])

  // If is nomadic, disable the switch and delete the cost
  useEffect(() => {
    if (isNomadic) {
      setIsFree(true)
      setValue('cost', 0)
    }
  }, [isNomadic, setValue])

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsFree(checked)
    if (checked) {
      setValue('cost', 0)
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align='start'>
        <FormControl width='auto'>
          <FormLabel htmlFor='isFree' mr={3}>
            {t('tools.is_free')}
          </FormLabel>
          <FormHelperText>
            {t('tools.tool_is_free_description', {
              defaultValue: 'No cost associated for loan the tool',
            })}
          </FormHelperText>
          <Switch
            mt={4}
            id='isFree'
            isChecked={isFree}
            onChange={handleSwitchChange}
            size={'lg'}
            disabled={isNomadic}
          />
        </FormControl>

        <FormControl flex={1} isDisabled={isFree} isInvalid={!!errors.cost}>
          <FormLabel>{t('tools.price_per_day', { defaultValue: 'Price per day' })}</FormLabel>
          <FormHelperText>
            {estimatedDailyCost
              ? t('tools.price_per_day_description', {
                  defaultValue:
                    '{{estimatedDailyCost }} {{, tokenSymbol }} is the suggested daily cost based on tool estimated value',
                  estimatedDailyCost: estimatedDailyCost,
                })
              : t('tools.price_per_day_description_no_value', { defaultValue: 'Set the cost for your tool' })}
          </FormHelperText>
          <Controller
            name='cost'
            control={control}
            defaultValue={cost}
            rules={{
              validate: (value) => {
                if (!isFree && (!value || value <= 0)) {
                  return t('tools.value_must_be_greater_than_zero', { defaultValue: 'Value must be greater than 0' })
                }
                return true
              },
            }}
            render={({ field }) => (
              <NumberInput mt={2} min={0} precision={0} isDisabled={isFree} {...field}>
                <NumberInputField placeholder={t('tools.enter_custom_cost', { defaultValue: 'Add custom cost' })} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
          <FormErrorMessage>{errors.cost?.message}</FormErrorMessage>
        </FormControl>
      </Stack>
      <FormControl flex={1} isInvalid={!!errors.toolValuation} isRequired={!isFree}>
        <FormLabel>{t('tools.tool_estimated_value', { defaultValue: 'Tool Estimated Value' })}</FormLabel>
        <FormHelperText>
          {t('tools.tool_estimated_value_description', {
            defaultValue: 'Set the estimated value of your tool.',
          })}
        </FormHelperText>
        <Controller
          name='toolValuation'
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
            <NumberInput mt={2} min={0} precision={0} {...field}>
              <NumberInputField placeholder={t('tools.enter_estimated_value')} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
        <FormErrorMessage>{errors.toolValuation?.message}</FormErrorMessage>
      </FormControl>
      <Collapse in={isNomadic} animateOpacity>
        <Alert status='info'>
          <AlertIcon />
          {t('tools.nomadic_cost_info', {
            defaultValue: 'Nomadic tools cannot have a cost associated with them.',
          })}
        </Alert>
      </Collapse>
    </Stack>
  )
}
