import api from "./api";
import type {
  CreateShowInput,
  UpdateShowInput,
  ShowResponse,
  ShowsResponse,
  PaginatedShowsResponse,
  ScheduleResponse,
} from "@/types/show";

/**
 * Get all shows (paginated)
 */
export const getShows = async (
  page = 1,
  limit = 10
): Promise<PaginatedShowsResponse> => {
  const response = await api.get<PaginatedShowsResponse>("/shows", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get a single show by ID
 */
export const getShow = async (id: string): Promise<ShowResponse> => {
  const response = await api.get<ShowResponse>(`/shows/${id}`);
  return response.data;
};

/**
 * Get shows for a specific station
 */
export const getShowsByStation = async (
  stationId: string
): Promise<ShowsResponse> => {
  const response = await api.get<ShowsResponse>(`/stations/${stationId}/shows`);
  return response.data;
};

/**
 * Get upcoming schedule for a station
 */
export const getStationSchedule = async (
  stationId: string
): Promise<ScheduleResponse> => {
  const response = await api.get<ScheduleResponse>(
    `/stations/${stationId}/schedule`
  );
  return response.data;
};

/**
 * Create a new show
 */
export const createShow = async (
  data: CreateShowInput
): Promise<ShowResponse> => {
  const response = await api.post<ShowResponse>("/shows", data);
  return response.data;
};

/**
 * Update a show
 */
export const updateShow = async (
  id: string,
  data: UpdateShowInput
): Promise<ShowResponse> => {
  const response = await api.patch<ShowResponse>(`/shows/${id}`, data);
  return response.data;
};

/**
 * Delete a show
 */
export const deleteShow = async (id: string): Promise<void> => {
  await api.delete(`/shows/${id}`);
};

export const showService = {
  getShows,
  getShow,
  getShowsByStation,
  getStationSchedule,
  createShow,
  updateShow,
  deleteShow,
};

export default showService;
