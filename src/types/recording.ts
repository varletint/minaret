export interface RecordingStation {
  _id: string;
  name: string;
  slug: string;
}

export interface RecordingShow {
  _id: string;
  title: string;
  hostName?: string;
  scheduledStart: string;
}

export interface Recording {
  _id: string;
  status: "ready" | "processing" | "failed"; // inferred status types
  stationId: RecordingStation;
  showId?: RecordingShow; // explicit optionality based on common patterns, though sample shows it populated
  mosqueId: string;
  startTime: string;
  initialDurationSecs: number;
  totalDurationSecs: number;
  createdAt: string;
  updatedAt: string;
  url?: string;
  // potentially other fields not in the snippet
}

export interface PublicRecordingsQuery {
  limit?: number;
  skip?: number;
  stationId?: string;
  mosqueId?: string;
}

export interface InternalRecordingsQuery extends PublicRecordingsQuery {
  // Add any internal-only query params if needed later
}

export interface PublicRecordingsResponse {
  status: string;
  results: number;
  total: number;
  data: {
    recordings: Recording[];
  };
}
