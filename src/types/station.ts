// Mosque location (embedded in mosque/station)
// export interface MosqueLocation {
//   city?: string;
//   country?: string;
//   address?: string;
// }

// Populated mosque reference
export interface PopulatedMosque {
  _id: string;
  name: string;
  slug: string;
  location: string;
}

// Current track info
export interface CurrentTrack {
  title?: string;
  artist?: string;
  album?: string;
  startedAt?: string;
}

// Station settings
export interface StationSettings {
  bitrate: number;
  format: "mp3" | "ogg" | "aac";
  isPublic: boolean;
}

export interface IcecastCredentials {
  username: string;
  password: string;
}

// Station statistics
export interface StationStats {
  totalListeners: number;
  peakListeners?: number;
  totalBroadcastMinutes?: number;
}

// Full Station type (from GET /stations/:slug or /stations/me)
export interface Station {
  _id: string;
  mosqueId: string | PopulatedMosque;
  name: string;
  slug: string;
  description?: string;
  streamUrl?: string;
  mountPoint: string;
  isLive: boolean;
  currentTrack?: CurrentTrack;
  settings: StationSettings;
  icecastCredentials: IcecastCredentials;
  stats: StationStats;
  createdAt: string;
  updatedAt: string;
}

// Station list item (partial data from GET /stations)
export interface StationListItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isLive: boolean;
  streamUrl?: string;
  currentTrack?: CurrentTrack;
  mosqueId: {
    _id: string;
    name: string;
    slug: string;
    location: string;
  };
  stats: {
    totalListeners: number;
  };
}

export interface CreateStationInput {
  name: string;
  description?: string;
  settings?: {
    bitrate?: "64" | "96" | "128" | "192" | "256" | "320";
    format?: "mp3" | "ogg" | "aac";
    isPublic?: boolean;
  };
}

export interface UpdateStationInput {
  name?: string;
  description?: string;
  settings?: {
    bitrate?: "64" | "96" | "128" | "192" | "256" | "320";
    format?: "mp3" | "ogg" | "aac";
    isPublic?: boolean;
  };
}

export interface UpdateNowPlayingInput {
  title?: string;
  artist?: string;
  album?: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  status: "success";
  data: T;
  message?: string;
  results?: number;
}

// GET /stations
export interface ListStationsResponse {
  status: "success";
  results: number;
  data: {
    stations: StationListItem[];
  };
}

// GET /stations/live
export interface ListLiveStationsResponse {
  status: "success";
  results: number;
  data: {
    stations: StationListItem[];
  };
}

// GET /stations/:slug or GET /stations/me
export interface GetStationResponse {
  status: "success";
  data: {
    station: Station;
  };
}

// POST /stations or PATCH /stations/me
export interface StationMutationResponse {
  status: "success";
  data: {
    station: Station;
  };
}

// GET /stations/:slug/now-playing
export interface GetNowPlayingResponse {
  status: "success";
  data: {
    stationName: string;
    isLive: boolean;
    currentTrack?: CurrentTrack;
  };
}

// PATCH /stations/me/now-playing
export interface UpdateNowPlayingResponse {
  status: "success";
  data: {
    currentTrack: CurrentTrack;
  };
}

// POST /stations/me/go-live
export interface GoLiveResponse {
  status: "success";
  message: string;
  data: {
    isLive: true;
    streamUrl?: string;
    mountPoint: string;
  };
}

// POST /stations/me/go-offline
export interface GoOfflineResponse {
  status: "success";
  message: string;
}

// Import Show type for schedule
import type { Show } from "./show";

/**
 * Display-friendly station type used by UI components
 * This bridges the gap between API response and what components expect
 */
export interface DisplayStation {
  _id?: string;
  id?: string;
  slug?: string;
  name: string;
  description?: string;
  location: string;
  listeners?: number;
  isLive: boolean;
  logo?: string;
  streamUrl?: string;
  currentTrack?: CurrentTrack;
  recurrence?: number[];
  schedule?: Show[];
  // For backwards compat with old mock data
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}
