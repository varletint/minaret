import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { setAccessToken } from "@/services/api";
import type { LoginCredentials, RegisterCredentials, User } from "@/types/auth";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
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
      // Update user in cache
      queryClient.setQueryData(authKeys.user(), data.data.user);
    },
    onError: () => {
      setAccessToken(null);
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
      // Update user in cache
      queryClient.setQueryData(authKeys.user(), data.data.user);
    },
    onError: () => {
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
      // Invalidate all queries
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails, clear local state
      setAccessToken(null);
      queryClient.setQueryData(authKeys.user(), null);
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
    user: userQuery.data as User | null | undefined,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
    error: userQuery.error,

    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
