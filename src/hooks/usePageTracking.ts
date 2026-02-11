import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/services/analytics";
import { usePlayerStore } from "@/stores/playerStore";

export const usePageTracking = () => {
  const location = useLocation();
  const { isPlaying, currentMosque } = usePlayerStore();
  const prevIsPlaying = useRef(isPlaying);

  useEffect(() => {
    trackEvent("PAGE_VIEW", { path: location.pathname });
  }, [location.pathname]);

  useEffect(() => {
    if (prevIsPlaying.current === isPlaying) return;

    if (isPlaying && currentMosque) {
      trackEvent("PLAY_START", {
        stationId: currentMosque.id,
        stationName: currentMosque.name,
        path: location.pathname,
      });
    } else if (!isPlaying && currentMosque) {
      trackEvent("PLAY_STOP", {
        stationId: currentMosque.id,
        stationName: currentMosque.name,
        path: location.pathname,
      });
    }

    prevIsPlaying.current = isPlaying;
  }, [isPlaying, currentMosque, location.pathname]);
};
