import type { User } from "./auth";

// Station type
export interface Station {
  id: string;
  name: string;
  description: string;
  logo?: string;
  streamUrl?: string;
  isLive: boolean;
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateStationInput {
  name: string;
  description: string;
  logo?: string;
  streamUrl?: string;
}

export interface UpdateStationInput {
  name?: string;
  description?: string;
  logo?: string;
  streamUrl?: string;
}

// Response types
export interface StationResponse {
  success: boolean;
  data: {
    station: Station;
  };
}

export interface StationsResponse {
  success: boolean;
  data: {
    stations: Station[];
  };
}

export interface PaginatedStationsResponse {
  success: boolean;
  data: {
    stations: Station[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
