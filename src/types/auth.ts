// Mosque type (the logged-in entity for station owners)
export interface Mosque {
  id: string;
  name: string;
  email: string;
  slug: string;
  location?: string;
}

export type User = Mosque;

// Profile update input
export interface UpdateProfileInput {
  name?: string;
  location?: string;
}

// Auth request/response types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  data: {
    mosque: Mosque;
    accessToken: string;
  };
  message?: string;
}

export interface UserResponse {
  status: string;
  data: {
    mosque: Mosque;
  };
}

export interface RefreshResponse {
  status: string;
  data: {
    accessToken: string;
  };
}

// API Error type
export interface ApiError {
  status: "error" | "fail";
  message: string;
  errors?: Record<string, string[]>;
}
