import React from 'react';
import {
  Box,
  Input,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useColorModeValue,
} from '@chakra-ui/react';
import { useController, Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface DateRangePickerProps {
  startName: string;
  endName: string;
  control: Control<any>;
  label?: string;
  isRequired?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const DateRangePicker = ({
  startName,
  endName,
  control,
  label,
  isRequired = false,
  minDate = new Date(),
  maxDate,
}: DateRangePickerProps) => {
  const { t } = useTranslation();
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const {
    field: startField,
    fieldState: { error: startError },
  } = useController({
    name: startName,
    control,
    rules: {
      required: isRequired && t('validation.required', { field: t('bookings.startDate') }),
    },
  });

  const {
    field: endField,
    fieldState: { error: endError },
  } = useController({
    name: endName,
    control,
    rules: {
      required: isRequired && t('validation.required', { field: t('bookings.endDate') }),
      validate: (value) => {
        if (!startField.value) return true;
        const start = new Date(startField.value);
        const end = new Date(value);
        return end > start || t('validation.endDateAfterStart');
      },
    },
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startField.onChange(e.target.value);
    // Reset end date if it's before new start date
    if (endField.value && new Date(endField.value) <= new Date(e.target.value)) {
      endField.onChange('');
    }
  };

  return (
    <FormControl isInvalid={!!startError || !!endError} isRequired={isRequired}>
      {label && <FormLabel>{label}</FormLabel>}
      <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
        <Box flex={1}>
          <Input
            type="date"
            {...startField}
            onChange={handleStartChange}
            min={formatDate(minDate)}
            max={maxDate ? formatDate(maxDate) : undefined}
            borderColor={borderColor}
          />
          {startError && (
            <FormErrorMessage>{startError.message}</FormErrorMessage>
          )}
        </Box>
        <Box flex={1}>
          <Input
            type="date"
            {...endField}
            min={startField.value || formatDate(minDate)}
            max={maxDate ? formatDate(maxDate) : undefined}
            borderColor={borderColor}
          />
          {endError && <FormErrorMessage>{endError.message}</FormErrorMessage>}
        </Box>
      </Stack>
    </FormControl>
  );
};
