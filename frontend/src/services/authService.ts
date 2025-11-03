import ApiHandler from '../utils/ApiHandler';
import type { AuthTypes } from '../types/auth.types';

class AuthService {
  
  // Register a new user
  static async register(data: AuthTypes.RegisterRequest): Promise<AuthTypes.RegisterResponse> {
    try {
      const response: any = await ApiHandler.post('/auth/register', data);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Login user
  static async login(data: AuthTypes.LoginRequest): Promise<AuthTypes.LoginResponse> {
    try {
      const response: any = await ApiHandler.post('/auth/login', data);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Logout user
  static async logout(): Promise<AuthTypes.LogoutResponse> {
    try {
      const response: any = await ApiHandler.post('/auth/logout', {});
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      return response;
    } catch (error) {
      console.error('Error logging out:', error);
      // Remove token even if API call fails
      localStorage.removeItem('token');
      throw error;
    }
  }

  // Get current user
  static async me(): Promise<AuthTypes.MeResponse> {
    try {
      const response: any = await ApiHandler.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get token from localStorage
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Update user profile
  static async updateProfile(data: {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    state: string;
  }): Promise<any> {
    try {
      const response: any = await ApiHandler.put('/auth/profile', data);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

export default AuthService;

