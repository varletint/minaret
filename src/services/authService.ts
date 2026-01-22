import api from "./api";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  UserResponse,
  RefreshResponse,
  UpdateProfileInput,
} from "@/types/auth";

/**
 * Register a new user
 */
export const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", credentials);
  return response.data;
};

/**
 * Login user
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

/**
 * Refresh access token (uses httpOnly cookie)
 */
export const refreshToken = async (): Promise<RefreshResponse> => {
  const response = await api.post<RefreshResponse>("/auth/refresh");
  return response.data;
};

/**
 * Logout user (clears refresh token cookie)
 */
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

/**
 * Get current authenticated user
 */
export const getMe = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>("/auth/me");
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await api.patch("/auth/password", { currentPassword, newPassword });
};

/**
 * Update mosque profile
 */
export const updateProfile = async (
  data: UpdateProfileInput
): Promise<UserResponse> => {
  const response = await api.patch<UserResponse>("/auth/profile", data);
  return response.data;
};

export const authService = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  changePassword,
  updateProfile,
};

export default authService;
