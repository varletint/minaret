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

export const useUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await authService.getMe();
        return response.data.mosque;
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    // gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);

      // queryClient.setQueryData(authKeys.user(), data.data.mosque);

      // queryClient.invalidateQueries({ queryKey: authKeys.session() });
      // queryClient.invalidateQueries({ queryKey: authKeys.permissions() });
      // queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // 2. Update user in cache IMMEDIATELY
      queryClient.setQueryData(authKeys.user(), data.data.mosque);
    },
    onError: (_error: AxiosError<ApiError>) => {
      setAccessToken(null);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);

      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      queryClient.invalidateQueries({ queryKey: authKeys.permissions() });
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      queryClient.setQueryData(authKeys.user(), data.data.mosque);
    },
    onError: (_error: AxiosError<ApiError>) => {
      setAccessToken(null);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setAccessToken(null);
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
    onError: (_error: AxiosError<ApiError>) => {
      setAccessToken(null);
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

export const useIsAuthenticated = (): boolean => {
  const { data: user, isLoading } = useUser();
  return !isLoading && !!user;
};

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

export const getAuthErrorMessage = (
  error: AxiosError<ApiError> | null
): string | null => {
  if (!error) return null;
  return error.response?.data?.message || error.message || "An error occurred";
};
