import { Tool as GlobalTool } from '../../types';

// Re-export the global Tool type to ensure consistency
export type Tool = GlobalTool;

// Additional tool-specific types
export interface ToolFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: File[];
  availability: {
    start: string;
    end: string;
  };
}

export interface ToolSearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  radius?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: 'price' | 'distance' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ToolFilterState {
  category: string;
  priceRange: [number, number];
  location: string;
  radius: number;
  dateRange: [Date | null, Date | null];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
