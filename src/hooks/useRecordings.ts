import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { recordingService } from "@/services/recordingService";
import type { PublicRecordingsQuery, Recording } from "@/types/recording";

export const recordingKeys = {
  all: ["recordings"] as const,
  lists: () => [...recordingKeys.all, "list"] as const,
  list: (query: PublicRecordingsQuery) =>
    [...recordingKeys.lists(), query] as const,
  myLists: () => [...recordingKeys.all, "my"] as const,
  myList: (query: { limit?: number; skip?: number }) =>
    [...recordingKeys.myLists(), query] as const,
  details: () => [...recordingKeys.all, "detail"] as const,
  detail: (id: string) => [...recordingKeys.details(), id] as const,
};

export const useRecordings = (
  query: PublicRecordingsQuery = {},
  enabled = true
) => {
  return useQuery({
    queryKey: recordingKeys.list(query),
    queryFn: () => recordingService.getPublicRecordings(query),
    placeholderData: keepPreviousData,
    enabled,
  });
};

export const useMyRecordings = (
  query: { limit?: number; skip?: number } = {}
) => {
  return useQuery({
    queryKey: recordingKeys.myList(query),
    queryFn: () => recordingService.getMyRecordings(query),
    placeholderData: keepPreviousData,
  });
};

export const useDeleteRecording = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recordingService.deleteRecording(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recordingKeys.all });
    },
  });
};

export const useRecording = (
  id: string | undefined,
  initialData?: Recording
) => {
  return useQuery({
    queryKey: recordingKeys.detail(id!),
    queryFn: () =>
      recordingService.getRecordingById(id!).then((res) => res.data.recording),
    enabled: !!id,
    initialData,
  });
};

export default useRecordings;
