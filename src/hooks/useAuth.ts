import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authService } from "@/services/authService";
import { setAccessToken } from "@/services/api";
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
  ApiError,
} from "@/types/auth";

// Query keys - more granular for targeted invalidation
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
  permissions: () => [...authKeys.all, "permissions"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

/**
 * Hook to get current authenticated user
 * - Runs on app load to check auth status
 * - staleTime prevents unnecessary refetches
 */
export const useUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await authService.getMe();
      return response.data.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401
  });
};

/**
 * Hook for user login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      // 1. Explicitly set access token
      setAccessToken(data.data.accessToken);

      // 2. Update user in cache
      queryClient.setQueryData(authKeys.user(), data.data.user);

      // 3. Invalidate related auth queries
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      queryClient.invalidateQueries({ queryKey: authKeys.permissions() });
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (_error: AxiosError<ApiError>) => {
      setAccessToken(null);
      // Error message available via: error.response?.data?.message
    },
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (data) => {
      // 1. Explicitly set access token
      setAccessToken(data.data.accessToken);

      // 2. Update user in cache
      queryClient.setQueryData(authKeys.user(), data.data.user);

      // 3. Invalidate related auth queries
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      queryClient.invalidateQueries({ queryKey: authKeys.permissions() });
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (_error: AxiosError<ApiError>) => {
      setAccessToken(null);
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear access token
      setAccessToken(null);
      // Clear user from cache
      queryClient.setQueryData(authKeys.user(), null);
      // Invalidate all auth-related queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      // Clear all cached data
      queryClient.clear();
    },
    onError: (_error: AxiosError<ApiError>) => {
      // Even if logout fails, clear local state
      setAccessToken(null);
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

/**
 * Helper hook to check if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  const { data: user, isLoading } = useUser();
  return !isLoading && !!user;
};

/**
 * Helper hook to get user with loading state
 */
export const useAuth = () => {
  const userQuery = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    // User state
    user: userQuery.data as User | null | undefined,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
    error: userQuery.error,

    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as AxiosError<ApiError> | null,

    // Register
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error as AxiosError<ApiError> | null,

    // Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};

/**
 * Helper to extract error message from API error
 */
export const getAuthErrorMessage = (
  error: AxiosError<ApiError> | null
): string | null => {
  if (!error) return null;
  return error.response?.data?.message || error.message || "An error occurred";
};
