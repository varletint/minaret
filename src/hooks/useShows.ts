import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showService } from "@/services/showService";
import type { CreateShowInput, UpdateShowInput } from "@/types/show";
import { stationKeys } from "./useStations";

// Query keys
export const showKeys = {
  all: ["shows"] as const,
  lists: () => [...showKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...showKeys.lists(), { page, limit }] as const,
  byStation: (stationId: string) =>
    [...showKeys.all, "station", stationId] as const,
  schedule: (stationId: string) =>
    [...showKeys.all, "schedule", stationId] as const,
  details: () => [...showKeys.all, "detail"] as const,
  detail: (id: string) => [...showKeys.details(), id] as const,
};

/**
 * Hook to get paginated shows
 */
export const useShows = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: showKeys.list(page, limit),
    queryFn: () => showService.getShows(page, limit),
  });
};

/**
 * Hook to get a single show
 */
export const useShow = (id: string) => {
  return useQuery({
    queryKey: showKeys.detail(id),
    queryFn: () => showService.getShow(id),
    enabled: !!id,
  });
};

/**
 * Hook to get shows for a specific station
 */
export const useShowsByStation = (stationId: string) => {
  return useQuery({
    queryKey: showKeys.byStation(stationId),
    queryFn: () => showService.getShowsByStation(stationId),
    enabled: !!stationId,
  });
};

/**
 * Hook to get station schedule
 */
export const useStationSchedule = (stationId: string) => {
  return useQuery({
    queryKey: showKeys.schedule(stationId),
    queryFn: () => showService.getStationSchedule(stationId),
    enabled: !!stationId,
  });
};

/**
 * Hook to create a show
 */
export const useCreateShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShowInput) => showService.createShow(data),
    onSuccess: (response) => {
      const show = response.data.show;
      // Invalidate show lists
      queryClient.invalidateQueries({ queryKey: showKeys.lists() });
      // Invalidate station-specific shows
      queryClient.invalidateQueries({
        queryKey: showKeys.byStation(show.stationId),
      });
      queryClient.invalidateQueries({
        queryKey: showKeys.schedule(show.stationId),
      });
    },
  });
};

/**
 * Hook to update a show
 */
export const useUpdateShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShowInput }) =>
      showService.updateShow(id, data),
    onSuccess: (response) => {
      const show = response.data.show;
      // Update cache for this specific show
      queryClient.setQueryData(showKeys.detail(show.id), response);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: showKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: showKeys.byStation(show.stationId),
      });
      queryClient.invalidateQueries({
        queryKey: showKeys.schedule(show.stationId),
      });
    },
  });
};

/**
 * Hook to delete a show
 */
export const useDeleteShow = (stationId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => showService.deleteShow(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: showKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: showKeys.lists() });
      // Invalidate station-specific if provided
      if (stationId) {
        queryClient.invalidateQueries({
          queryKey: showKeys.byStation(stationId),
        });
        queryClient.invalidateQueries({
          queryKey: showKeys.schedule(stationId),
        });
      }
    },
  });
};
