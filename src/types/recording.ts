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

export interface RecordingChunk {
  index: number;
  filename: string;
  storagePath: string;
  publicUrl: string;
  codec: "mp3" | "aac";
  durationSecs?: number;
  sizeBytes?: number;
  uploadedAt: string;
}

export interface Recording {
  _id: string;
  status: "ready" | "processing" | "failed";
  stationId: RecordingStation;
  showId?: RecordingShow;
  title?: string;
  hostName?: string;
  mosqueId: string;
  startedAt: string;
  initialDurationSecs: number;
  totalDurationSecs: number;
  createdAt: string;
  updatedAt: string;
  chunks?: RecordingChunk[];
  url?: string;
}

export interface PublicRecordingsQuery {
  limit?: number;
  skip?: number;
  stationId?: string;
  mosqueId?: string;
}

export interface PublicRecordingsResponse {
  status: string;
  results: number;
  total: number;
  data: {
    recordings: Recording[];
  };
}

export interface SingleRecordingResponse {
  status: string;
  data: {
    recording: Recording;
  };
}
