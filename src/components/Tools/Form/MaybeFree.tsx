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
import { Controller, useFormContext } from 'react-hook-form'
import { ToolFormData } from '~components/Tools/Form'

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

  useEffect(() => {
    // Check initial value and set switch state
    const value = watch('toolValuation')
    if (value === 0) {
      setIsFree(true)
    }
  }, [])

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsFree(checked)
    if (checked) {
      setValue('toolValuation', 0)
      setValue('cost', 0)
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align='start'>
        <FormControl display='flex' flexDirection={'column'} alignItems='start' width='auto' gap={1}>
          <FormLabel htmlFor='isFree' mr={3}>
            {t('tools.is_free')}
          </FormLabel>
          <Text fontSize='sm' color='lighterText'>
            {t('tools.tool_is_free_description', {
              defaultValue: 'No cost associated for loan the tool',
            })}
          </Text>
          <Switch mt={4} id='isFree' isChecked={isFree} onChange={handleSwitchChange} size={'lg'} />
        </FormControl>
        {/*<Stack>*/}
        <FormControl flex={1} isDisabled={isFree} isInvalid={!!errors.toolValuation} isRequired={!isFree}>
          <FormLabel>{t('tools.estimated_value', { defaultValue: 'Estimated Value' })}</FormLabel>
          <Text fontSize='sm' color='lighterText'>
            {t('tools.tool_estimated_value_description', {
              defaultValue:
                'Set the estimated value of your tool. If the tool is not free, this value will be used to calculate the cost per day.',
            })}
          </Text>
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
              <NumberInput mt={2} min={0} precision={0} isDisabled={isFree} {...field}>
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
      </Stack>
      {estimatedDailyCost && (
        <FormControl flex={1} isDisabled={isFree} isInvalid={!!errors.cost}>
          <FormLabel>{t('tools.price_per_day', { defaultValue: 'Price per day' })}</FormLabel>
          <Text fontSize='sm' color='lighterText'>
            {t('tools.price_per_day_description', {
              defaultValue:
                'You can set a custom daily price for your tool, but it must not exceed the estimated daily cost  ' +
                "({{estimatedDailyCost }} {{, tokenSymbol }}), which is based on the tool's value.",
              estimatedDailyCost: estimatedDailyCost,
            })}
          </Text>
          <Controller
            name='cost'
            control={control}
            defaultValue={cost}
            rules={{
              validate: (value) => {
                if (!isFree && (!value || value <= 0)) {
                  return t('tools.value_must_be_greater_than_zero', { defaultValue: 'Value must be greater than 0' })
                }
                if (!isFree && Number(value) > estimatedDailyCost) {
                  return t('tools.value_must_be_less_than', {
                    defaultValue: 'Value must be less than tool estimated value {{ cost }} {{, tokenSymbol }}',
                    cost: estimatedDailyCost,
                  })
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
      )}
    </Stack>
  )
}
