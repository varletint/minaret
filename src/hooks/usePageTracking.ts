import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/services/analytics";

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackEvent("PAGE_VIEW", { path: location.pathname });
  }, [location.pathname]);
};
