import api from "./api";
import type {
  PublicRecordingsQuery,
  PublicRecordingsResponse,
} from "@/types/recording";

/**
 * Get public recordings
 */
export const getPublicRecordings = async (
  query: PublicRecordingsQuery = {}
): Promise<PublicRecordingsResponse> => {
  const { limit = 20, skip = 0, stationId, mosqueId } = query;

  const response = await api.get<PublicRecordingsResponse>(
    "/recordings/public",
    {
      params: {
        limit,
        skip,
        stationId,
        mosqueId,
      },
    }
  );

  return response.data;
};

/**
 * Get recordings for the authenticated mosque
 */
export const getMyRecordings = async (
  query: { limit?: number; skip?: number } = {}
): Promise<PublicRecordingsResponse> => {
  const { limit = 20, skip = 0 } = query;
  const response = await api.get<PublicRecordingsResponse>("/recordings", {
    params: { limit, skip },
  });
  return response.data;
};

/**
 * Delete a recording by ID
 */
export const deleteRecording = async (id: string): Promise<void> => {
  await api.delete(`/recordings/${id}`);
};

export const recordingService = {
  getPublicRecordings,
  getMyRecordings,
  deleteRecording,
};

export default recordingService;
