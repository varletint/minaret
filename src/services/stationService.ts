import api from "./api";
import type {
  CreateStationInput,
  UpdateStationInput,
  StationResponse,
  StationsResponse,
  PaginatedStationsResponse,
} from "@/types/station";

/**
 * Get all stations (paginated)
 */
export const getStations = async (
  page = 1,
  limit = 10
): Promise<PaginatedStationsResponse> => {
  const response = await api.get<PaginatedStationsResponse>("/stations", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get a single station by ID
 */
export const getStation = async (id: string): Promise<StationResponse> => {
  const response = await api.get<StationResponse>(`/stations/${id}`);
  return response.data;
};

/**
 * Get stations owned by current user
 */
export const getMyStations = async (): Promise<StationsResponse> => {
  const response = await api.get<StationsResponse>("/stations/my");
  return response.data;
};

/**
 * Create a new station
 */
export const createStation = async (
  data: CreateStationInput
): Promise<StationResponse> => {
  const response = await api.post<StationResponse>("/stations", data);
  return response.data;
};

/**
 * Update a station
 */
export const updateStation = async (
  id: string,
  data: UpdateStationInput
): Promise<StationResponse> => {
  const response = await api.patch<StationResponse>(`/stations/${id}`, data);
  return response.data;
};

/**
 * Delete a station
 */
export const deleteStation = async (id: string): Promise<void> => {
  await api.delete(`/stations/${id}`);
};

/**
 * Start broadcasting (set station live)
 */
export const startBroadcast = async (id: string): Promise<StationResponse> => {
  const response = await api.post<StationResponse>(
    `/stations/${id}/broadcast/start`
  );
  return response.data;
};

/**
 * Stop broadcasting
 */
export const stopBroadcast = async (id: string): Promise<StationResponse> => {
  const response = await api.post<StationResponse>(
    `/stations/${id}/broadcast/stop`
  );
  return response.data;
};

export const stationService = {
  getStations,
  getStation,
  getMyStations,
  createStation,
  updateStation,
  deleteStation,
  startBroadcast,
  stopBroadcast,
};

export default stationService;
