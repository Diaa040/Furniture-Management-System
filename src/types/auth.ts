export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface RegisterResponse {
  status: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}


export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

