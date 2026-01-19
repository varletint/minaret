// User type
export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "station_owner";
  createdAt: string;
  updatedAt: string;
}

// Auth request/response types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
  };
  message?: string;
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
}

// API Error type
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
