import React from 'react';
import {
  Container,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCreateTool } from '../../../hooks/queries';
import { TOOL_CATEGORIES } from '../../../constants';

interface NewToolForm {
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  images: FileList;
}

export const NewToolPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewToolForm>();
  const createTool = useCreateTool();

  const onSubmit = async (data: NewToolForm) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('price', data.price.toString());
      formData.append('location', data.location);

      Array.from(data.images).forEach((file) => {
        formData.append('images', file);
      });

      await createTool.mutateAsync(formData);

      toast({
        title: t('tools.createSuccess'),
        status: 'success',
        duration: 3000,
      });

      navigate('/tools');
    } catch (error) {
      console.error('Failed to create tool:', error);
      toast({
        title: t('tools.createError'),
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Stack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={6}
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Heading size="lg">{t('tools.addTool')}</Heading>

        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>{t('tools.name')}</FormLabel>
          <Input {...register('name', { required: true })} />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.description}>
          <FormLabel>{t('tools.description')}</FormLabel>
          <Textarea {...register('description', { required: true })} />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.category}>
          <FormLabel>{t('tools.category')}</FormLabel>
          <Select {...register('category', { required: true })}>
            <option value="">{t('tools.selectCategory')}</option>
            {TOOL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {t(`categories.${category}`)}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.price}>
          <FormLabel>{t('tools.pricePerDay')}</FormLabel>
          <NumberInput min={1}>
            <NumberInputField {...register('price', { required: true, min: 1 })} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.location}>
          <FormLabel>{t('tools.location')}</FormLabel>
          <Input {...register('location', { required: true })} />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.images}>
          <FormLabel>{t('tools.images')}</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            {...register('images', { required: true })}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          isLoading={isSubmitting}
        >
          {t('tools.create')}
        </Button>
      </Stack>
    </Container>
  );
};
