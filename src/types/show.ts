import type { Station } from "./station";

// Recurrence pattern type
export interface Recurrence {
  pattern: "weekly";
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
}

// Show type
export interface Show {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  stationId: string;
  station?: Station;
  scheduledStart: string;
  scheduledEnd: string;
  isRecurring: boolean;
  recurrence?: Recurrence;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateShowInput {
  title: string;
  description: string;
  thumbnail?: string;
  stationId: string;
  scheduledStart: string;
  scheduledEnd: string;
  isRecurring?: boolean;
  recurrence?: Recurrence;
}

export interface UpdateShowInput {
  title?: string;
  description?: string;
  thumbnail?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  isRecurring?: boolean;
  recurrence?: Recurrence;
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
    shows: Show[];
  };
}
