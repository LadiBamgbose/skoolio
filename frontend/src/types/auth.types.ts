export namespace AuthTypes {
  export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    city: string;
    state: string;
    plan: 'BASIC' | 'TEACHER' | 'ADVANCED';
    createdAt: string;
  }

  export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    city: string;
    state: string;
  }

  export interface RegisterResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
  }

  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
  }

  export interface LogoutResponse {
    success: boolean;
    message: string;
  }

  export interface MeResponse {
    success: boolean;
    user: User;
  }
}

