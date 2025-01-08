import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { LoginForm, RegisterForm, SearchFilters } from '../types';

// Auth queries
export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginForm) => api.auth.login(data),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterForm) => api.auth.register(data),
  });

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.auth.getCurrentUser();
      return response.data.data;
    },
  });

// Tools queries
export const useTools = (filters?: SearchFilters) =>
  useQuery({
    queryKey: ['tools', filters],
    queryFn: async () => {
      const response = await api.tools.getAll(filters);
      return response.data;
    },
  });

export const useTool = (id: string) =>
  useQuery({
    queryKey: ['tool', id],
    queryFn: async () => {
      const response = await api.tools.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });

export const useCreateTool = () =>
  useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.tools.create(data);
      return response.data.data;
    },
  });

export const useUpdateTool = (id: string) =>
  useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.tools.update(id, data);
      return response.data.data;
    },
  });

export const useDeleteTool = () =>
  useMutation({
    mutationFn: (id: string) => api.tools.delete(id),
  });

// Bookings queries
export const useBookings = () =>
  useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await api.bookings.getAll();
      return response.data;
    },
  });

export const useBooking = (id: string) =>
  useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const response = await api.bookings.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });

export const useCreateBooking = () =>
  useMutation({
    mutationFn: async ({
      toolId,
      data,
    }: {
      toolId: string;
      data: { startDate: string; endDate: string };
    }) => {
      const response = await api.bookings.create(toolId, data);
      return response.data.data;
    },
  });

export const useUpdateBookingStatus = () =>
  useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    }) => {
      const response = await api.bookings.updateStatus(id, status);
      return response.data.data;
    },
  });

export const useCancelBooking = () =>
  useMutation({
    mutationFn: (id: string) => api.bookings.cancel(id),
  });

// Rating queries
export const useCreateRating = () =>
  useMutation({
    mutationFn: async ({
      toolId,
      bookingId,
      data,
    }: {
      toolId: string;
      bookingId: string;
      data: { rating: number; comment: string };
    }) => {
      const response = await api.ratings.create(toolId, bookingId, data);
      return response.data.data;
    },
  });

export const useToolRatings = (toolId: string) =>
  useQuery({
    queryKey: ['toolRatings', toolId],
    queryFn: async () => {
      const response = await api.ratings.getByTool(toolId);
      return response.data.data;
    },
    enabled: !!toolId,
  });

export const useUserRatings = (userId: string) =>
  useQuery({
    queryKey: ['userRatings', userId],
    queryFn: async () => {
      const response = await api.ratings.getByUser(userId);
      return response.data.data;
    },
    enabled: !!userId,
  });

// User queries
export const useUpdateProfile = () =>
  useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.users.updateProfile(data);
      return response.data.data;
    },
  });

export const useUserTools = (userId: string) =>
  useQuery({
    queryKey: ['userTools', userId],
    queryFn: async () => {
      const response = await api.users.getTools(userId);
      return response.data;
    },
    enabled: !!userId,
  });

export const useUserBookings = (userId: string) =>
  useQuery({
    queryKey: ['userBookings', userId],
    queryFn: async () => {
      const response = await api.users.getBookings(userId);
      return response.data;
    },
    enabled: !!userId,
  });
