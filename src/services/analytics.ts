import api from "./api";

type EventType = "PAGE_VIEW" | "PLAY_START" | "PLAY_STOP";

interface TrackEventPayload {
  stationId?: string;
  path?: string;
  [key: string]: unknown;
}

const SESSION_KEY = "minaret_session_id";

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const sendWithBeacon = (
  type: EventType,
  payload: TrackEventPayload
): boolean => {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const url = `${baseUrl}/api/analytics/events`;
  const data = JSON.stringify({
    type,
    payload: { ...payload, sessionId: getSessionId() },
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([data], { type: "application/json" });
    return navigator.sendBeacon(url, blob);
  }
  return false;
};

export const trackEvent = (
  type: EventType,
  payload: TrackEventPayload = {}
) => {
  const eventPayload = { ...payload, sessionId: getSessionId() };

  api
    .post("/api/analytics/events", { type, payload: eventPayload })
    .catch(() => {});
};

export const trackCriticalEvent = (
  type: EventType,
  payload: TrackEventPayload = {}
) => {
  const sent = sendWithBeacon(type, payload);

  if (!sent) {
    trackEvent(type, payload);
  }
};
