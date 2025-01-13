import React from 'react';
import {
  Box,
  Stack,
  Button,
  Text,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
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

// Form data uses strings since DateRangePicker returns strings
interface BookingFormData {
  startDate: string;
  endDate: string;
  contact?: string;
  comments?: string;
}

export const BookingForm = ({ tool }: BookingFormProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');

  const { control, register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      contact: '',
      comments: ''
    },
    mode: 'onChange'
  });

  const formatDateForApi = (date: string): number => {
    return Math.floor(new Date(date).getTime() / 1000);
  };
  
  const createBooking = useCreateBooking();

  const onSubmit = async (formData: BookingFormData) => {
    try {
      const bookingData = {
        toolId: tool.id.toString(),
        startDate: formatDateForApi(formData.startDate),
        endDate: formatDateForApi(formData.endDate),
        contact: formData.contact,
        comments: formData.comments
      };
      
      await createBooking.mutateAsync(bookingData);

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

  // Get today's date for minDate since there's no availability in the Tool model
  const minDate = new Date();
  // Set maxDate to 6 months from now as a reasonable default
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);

  // If tool has reservedDates, we could use that to disable specific dates
  // but it's currently typed as any | null in the Tool model

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
        <Stack spacing={4}>
          <DateRangePicker
            control={control}
            startName="startDate"
            endName="endDate"
            label={t('bookings.dates')}
            isRequired
            minDate={minDate}
            maxDate={maxDate}
          />

          <FormControl>
            <FormLabel>{t('bookings.contact')}</FormLabel>
            <Input
              {...register('contact', {
                maxLength: {
                  value: 100,
                  message: t('validation.maxLength', { max: 100 })
                }
              })}
              placeholder={t('bookings.contactPlaceholder')}
            />
            {errors.contact && (
              <FormErrorMessage>{errors.contact.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>{t('bookings.comments')}</FormLabel>
            <Textarea
              {...register('comments', {
                maxLength: {
                  value: 500,
                  message: t('validation.maxLength', { max: 500 })
                }
              })}
              placeholder={t('bookings.commentsPlaceholder')}
              rows={4}
            />
            {errors.comments && (
              <FormErrorMessage>{errors.comments.message}</FormErrorMessage>
            )}
          </FormControl>
          <Text fontSize="sm" color="gray.600">
            {t('tools.pricePerDay')}: {tool.cost}€
          </Text>
          {tool.mayBeFree && (
            <Text fontSize="sm" color="blue.500">
              {t('tools.mayBeFreeNote')}
            </Text>
          )}
          {tool.askWithFee && (
            <Text fontSize="sm" color="purple.500">
              {t('tools.askWithFeeNote')}
            </Text>
          )}
        </Stack>

        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          isLoading={createBooking.isPending}
          isDisabled={!tool.isAvailable}
        >
          {t('bookings.book')}
        </Button>
      </Stack>
    </Box>
  );
};
