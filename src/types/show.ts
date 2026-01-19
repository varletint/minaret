import type { Station } from "./station";

// Show type
export interface Show {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  stationId: string;
  station?: Station;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays?: number[]; // 0-6 (Sunday-Saturday)
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateShowInput {
  title: string;
  description: string;
  thumbnail?: string;
  stationId: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
  recurringDays?: number[];
}

export interface UpdateShowInput {
  title?: string;
  description?: string;
  thumbnail?: string;
  startTime?: string;
  endTime?: string;
  isRecurring?: boolean;
  recurringDays?: number[];
}

// Response types
export interface ShowResponse {
  success: boolean;
  data: {
    show: Show;
  };
}

export interface ShowsResponse {
  success: boolean;
  data: {
    shows: Show[];
  };
}

export interface PaginatedShowsResponse {
  success: boolean;
  data: {
    shows: Show[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Schedule type for upcoming shows
export interface ScheduleResponse {
  success: boolean;
  data: {
    schedule: Show[];
  };
}
