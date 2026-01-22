import api from "./api";
import type {
  CreateStationInput,
  UpdateStationInput,
  UpdateNowPlayingInput,
  ListStationsResponse,
  ListLiveStationsResponse,
  GetStationResponse,
  StationMutationResponse,
  GetNowPlayingResponse,
  UpdateNowPlayingResponse,
  GoLiveResponse,
  GoOfflineResponse,
} from "@/types/station";

/**
 * Get all stations (sorted by listeners)
 * GET /stations
 */
export const getStations = async (): Promise<ListStationsResponse> => {
  const response = await api.get<ListStationsResponse>("/stations");
  return response.data;
};

/**
 * Get only live stations
 * GET /stations/live
 */
export const getLiveStations = async (): Promise<ListLiveStationsResponse> => {
  const response = await api.get<ListLiveStationsResponse>("/stations/live");
  return response.data;
};

/**
 * Get a single station by slug
 * GET /stations/:slug
 */
export const getStationBySlug = async (
  slug: string
): Promise<GetStationResponse> => {
  const response = await api.get<GetStationResponse>(`/stations/${slug}`);
  return response.data;
};

/**
 * Get now playing for a station
 * GET /stations/:slug/now-playing
 */
export const getNowPlaying = async (
  slug: string
): Promise<GetNowPlayingResponse> => {
  const response = await api.get<GetNowPlayingResponse>(
    `/stations/${slug}/now-playing`
  );
  return response.data;
};

/**
 * Get my station (current logged-in mosque)
 * GET /stations/me
 */
export const getMyStation = async (): Promise<GetStationResponse> => {
  const response = await api.get<GetStationResponse>("/stations/me");
  return response.data;
};

/**
 * Create a new station (first-time setup)
 * POST /stations
 */
export const createStation = async (
  data: CreateStationInput
): Promise<StationMutationResponse> => {
  const response = await api.post<StationMutationResponse>("/stations", data);
  return response.data;
};

/**
 * Update my station
 * PATCH /stations/me
 */
export const updateMyStation = async (
  data: UpdateStationInput
): Promise<StationMutationResponse> => {
  const response = await api.patch<StationMutationResponse>(
    "/stations/me",
    data
  );
  return response.data;
};

/**
 * Update now playing track
 * PATCH /stations/me/now-playing
 */
export const updateNowPlaying = async (
  data: UpdateNowPlayingInput
): Promise<UpdateNowPlayingResponse> => {
  const response = await api.patch<UpdateNowPlayingResponse>(
    "/stations/me/now-playing",
    data
  );
  return response.data;
};

/**
 * Go live (start broadcasting)
 * POST /stations/me/go-live
 */
export const goLive = async (): Promise<GoLiveResponse> => {
  const response = await api.post<GoLiveResponse>("/stations/me/go-live");
  return response.data;
};

/**
 * Go offline (stop broadcasting)
 * POST /stations/me/go-offline
 */
export const goOffline = async (): Promise<GoOfflineResponse> => {
  const response = await api.post<GoOfflineResponse>("/stations/me/go-offline");
  return response.data;
};

export const stationService = {
  getStations,
  getLiveStations,
  getStationBySlug,
  getNowPlaying,

  getMyStation,
  createStation,
  updateMyStation,
  updateNowPlaying,
  goLive,
  goOffline,
};

export default stationService;
