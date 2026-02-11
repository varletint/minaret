import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { recordingService } from "@/services/recordingService";
import type { PublicRecordingsQuery } from "@/types/recording";

export const recordingKeys = {
  all: ["recordings"] as const,
  lists: () => [...recordingKeys.all, "list"] as const,
  list: (query: PublicRecordingsQuery) =>
    [...recordingKeys.lists(), query] as const,
};

export const useRecordings = (query: PublicRecordingsQuery = {}) => {
  return useQuery({
    queryKey: recordingKeys.list(query),
    queryFn: () => recordingService.getPublicRecordings(query),
    placeholderData: keepPreviousData,
  });
};

export default useRecordings;
