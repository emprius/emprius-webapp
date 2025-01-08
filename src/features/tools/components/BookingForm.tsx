import React from 'react';
import {
  Box,
  Stack,
  Button,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCreateBooking } from '../../../hooks/queries';
import { DateRangePicker } from '../../../components/shared/Form/DateRangePicker';
import type { Tool } from '../../../types';

interface BookingFormProps {
  tool: Tool;
}

interface BookingFormData {
  startDate: string;
  endDate: string;
}

export const BookingForm = ({ tool }: BookingFormProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');

  const { control, handleSubmit } = useForm<BookingFormData>();
  const createBooking = useCreateBooking();

  const onSubmit = async (data: BookingFormData) => {
    try {
      await createBooking.mutateAsync({
        toolId: tool.id,
        data: {
          startDate: data.startDate,
          endDate: data.endDate,
        },
      });

      toast({
        title: t('bookings.success'),
        status: 'success',
        duration: 3000,
      });

      navigate('/profile');
    } catch (error) {
      console.error('Failed to create booking:', error);
      toast({
        title: t('bookings.error'),
        description: t('bookings.tryAgain'),
        status: 'error',
        duration: 5000,
      });
    }
  };

  const availability = tool.availability;
  const minDate = new Date(availability.start);
  const maxDate = new Date(availability.end);

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="sm"
    >
      <Stack spacing={6}>
        <DateRangePicker
          control={control}
          startName="startDate"
          endName="endDate"
          label={t('bookings.dates')}
          isRequired
          minDate={minDate}
          maxDate={maxDate}
        />

        <Stack spacing={2}>
          <Text fontSize="sm" color="gray.600">
            {t('tools.pricePerDay')}: {tool.price}€
          </Text>
        </Stack>

        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          isLoading={createBooking.isPending}
          isDisabled={tool.status !== 'available'}
        >
          {t('bookings.book')}
        </Button>
      </Stack>
    </Box>
  );
};
