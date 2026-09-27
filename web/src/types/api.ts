// LiverAsist - API Type Definitions

export interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface AuthTokens {
  access_token: string;
  token_type: 'bearer';
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  role: 'clinician' | 'admin';
  created_at: string;
}
