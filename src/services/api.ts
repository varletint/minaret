import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// In-memory token storage (more secure than localStorage)
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for httpOnly cookies (refresh token)
});

// Request interceptor - attach access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track refresh attempts to prevent infinite loops
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => {
    // Capture new access token from responses (login, register, refresh)
    if (response.data?.data?.accessToken) {
      setAccessToken(response.data.data.accessToken);
      refreshAttempts = 0; // Reset on successful token capture
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Network error (backend down, CORS, etc.) - fail immediately
    if (!error.response) {
      console.warn("[API] Network error - backend may be down");
      return Promise.reject(error);
    }

    // Skip refresh logic for auth endpoints
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");
    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register");
    const isMeRequest = originalRequest.url?.includes("/auth/me");

    // If /auth/me fails and we had no token to begin with, don't try to refresh
    const hadNoToken = !originalRequest.headers?.Authorization;

    // Handle 401 - attempt token refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isAuthRequest
    ) {
      // Don't retry /auth/me if we never had a token
      if (isMeRequest && hadNoToken) {
        return Promise.reject(error);
      }

      // Prevent infinite refresh loops
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        console.warn("[API] Max refresh attempts reached, clearing auth");
        setAccessToken(null);
        refreshAttempts = 0;
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      refreshAttempts++;

      try {
        // Refresh token is sent automatically via httpOnly cookie
        const response = await api.post("/auth/refresh");
        const { accessToken: newAccessToken } = response.data.data;

        setAccessToken(newAccessToken);
        refreshAttempts = 0; // Reset on success
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear token
        setAccessToken(null);
        refreshAttempts = 0;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
