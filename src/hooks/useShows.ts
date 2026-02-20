import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showService } from "@/services/showService";
import type { CreateShowInput, UpdateShowInput } from "@/types/show";

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

export const useShows = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: showKeys.list(page, limit),
    queryFn: () => showService.getShows(page, limit),
  });
};

export const useShow = (id: string) => {
  return useQuery({
    queryKey: showKeys.detail(id),
    queryFn: () => showService.getShow(id),
    enabled: !!id,
  });
};

export const useShowsByStation = (stationId: string) => {
  return useQuery({
    queryKey: showKeys.byStation(stationId),
    queryFn: () => showService.getShowsByStation(stationId),
    enabled: !!stationId,
  });
};

export const useStationSchedule = (stationId: string) => {
  return useQuery({
    queryKey: showKeys.schedule(stationId),
    queryFn: () => showService.getStationSchedule(stationId),
    enabled: !!stationId,
  });
};

export const useCreateShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShowInput) => showService.createShow(data),
    onSuccess: (response) => {
      const show = response.data.show;
      queryClient.invalidateQueries({ queryKey: showKeys.all });
      queryClient.invalidateQueries({
        queryKey: showKeys.byStation(show.stationId),
      });
      queryClient.invalidateQueries({
        queryKey: showKeys.schedule(show.stationId),
      });
    },
  });
};

export const useUpdateShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, data }: { _id: string; data: UpdateShowInput }) =>
      showService.updateShow(_id, data),
    onSuccess: (response) => {
      const show = response.data.show;
      queryClient.setQueryData(showKeys.detail(show._id), response);
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

export const useDeleteShow = (stationId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => showService.deleteShow(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: showKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: showKeys.lists() });
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
