import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stationService } from "@/services/stationService";
import type {
  CreateStationInput,
  UpdateStationInput,
  Station,
} from "@/types/station";

// Query keys
export const stationKeys = {
  all: ["stations"] as const,
  lists: () => [...stationKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...stationKeys.lists(), { page, limit }] as const,
  my: () => [...stationKeys.all, "my"] as const,
  details: () => [...stationKeys.all, "detail"] as const,
  detail: (id: string) => [...stationKeys.details(), id] as const,
};

/**
 * Hook to get paginated stations
 */
export const useStations = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: stationKeys.list(page, limit),
    queryFn: () => stationService.getStations(page, limit),
  });
};

/**
 * Hook to get a single station
 */
export const useStation = (id: string) => {
  return useQuery({
    queryKey: stationKeys.detail(id),
    queryFn: () => stationService.getStation(id),
    enabled: !!id,
  });
};

/**
 * Hook to get current user's stations
 */
export const useMyStations = () => {
  return useQuery({
    queryKey: stationKeys.my(),
    queryFn: () => stationService.getMyStations(),
  });
};

/**
 * Hook to create a station
 */
export const useCreateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStationInput) =>
      stationService.createStation(data),
    onSuccess: () => {
      // Invalidate station lists to refetch
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stationKeys.my() });
    },
  });
};

/**
 * Hook to update a station
 */
export const useUpdateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStationInput }) =>
      stationService.updateStation(id, data),
    onSuccess: (response) => {
      const station = response.data.station;
      // Update cache for this specific station
      queryClient.setQueryData(stationKeys.detail(station.id), response);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stationKeys.my() });
    },
  });
};

/**
 * Hook to delete a station
 */
export const useDeleteStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stationService.deleteStation(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: stationKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stationKeys.my() });
    },
  });
};

/**
 * Hook to start broadcasting
 */
export const useStartBroadcast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stationService.startBroadcast(id),
    onSuccess: (response) => {
      const station = response.data.station;
      queryClient.setQueryData(stationKeys.detail(station.id), response);
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
    },
  });
};

/**
 * Hook to stop broadcasting
 */
export const useStopBroadcast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stationService.stopBroadcast(id),
    onSuccess: (response) => {
      const station = response.data.station;
      queryClient.setQueryData(stationKeys.detail(station.id), response);
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
    },
  });
};
