import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stationService } from "@/services/stationService";
import type {
  CreateStationInput,
  UpdateStationInput,
  UpdateNowPlayingInput,
} from "@/types/station";

export const stationKeys = {
  all: ["stations"] as const,
  lists: () => [...stationKeys.all, "list"] as const,
  live: () => [...stationKeys.all, "live"] as const,
  my: () => [...stationKeys.all, "my"] as const,
  details: () => [...stationKeys.all, "detail"] as const,
  detail: (slug: string) => [...stationKeys.details(), slug] as const,
  nowPlaying: (slug: string) =>
    [...stationKeys.all, "now-playing", slug] as const,
};

/**
 * Hook to get all stations
 */
export const useStations = () => {
  return useQuery({
    queryKey: stationKeys.lists(),
    queryFn: () => stationService.getStations(),
  });
};

/**
 * Hook to get live stations only
 */
export const useLiveStations = () => {
  return useQuery({
    queryKey: stationKeys.live(),
    queryFn: () => stationService.getLiveStations(),
  });
};

/**
 * Hook to get a single station by slug
 */
export const useStation = (slug: string) => {
  return useQuery({
    queryKey: stationKeys.detail(slug),
    queryFn: () => stationService.getStationBySlug(slug),
    enabled: !!slug,
  });
};

/**
 * Hook to get now playing for a station
 */
export const useNowPlaying = (
  slug: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: stationKeys.nowPlaying(slug),
    queryFn: () => stationService.getNowPlaying(slug),
    enabled: options?.enabled !== false && !!slug,
    refetchInterval: 30000,
  });
};

/**
 * Hook to get current mosque's station
 */
export const useMyStation = () => {
  return useQuery({
    queryKey: stationKeys.my(),
    queryFn: () => stationService.getMyStation(),
  });
};

/**
 * Hook to create a station (first-time setup)
 */
export const useCreateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStationInput) =>
      stationService.createStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stationKeys.my() });
    },
  });
};

/**
 * Hook to update my station
 */
export const useUpdateMyStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStationInput) =>
      stationService.updateMyStation(data),
    onSuccess: (response) => {
      const station = response.data.station;

      queryClient.setQueryData(stationKeys.my(), response);
      if (station.slug) {
        queryClient.setQueryData(stationKeys.detail(station.slug), response);
      }
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
    },
  });
};

/**
 * Hook to update now playing track
 */
export const useUpdateNowPlaying = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNowPlayingInput) =>
      stationService.updateNowPlaying(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stationKeys.my() });
    },
  });
};

/**
 * Hook to go live (start broadcasting)
 */
export const useGoLive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => stationService.goLive(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stationKeys.my() });
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stationKeys.live() });
    },
  });
};

/**
 * Hook to go offline (stop broadcasting)
 */
export const useGoOffline = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => stationService.goOffline(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stationKeys.my() });
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stationKeys.live() });
    },
  });
};
