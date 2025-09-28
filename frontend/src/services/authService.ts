import ApiHandler from '../utils/ApiHandler';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  city?: string;
  state?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  user?: any;
  success: boolean;
  message?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
}

class AuthService {
  
  // User signup
  static async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      const response: any = await ApiHandler.post('/auth/signup', userData);
      
      // Store token if provided
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }

  // User login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: any = await ApiHandler.post('/auth/login', credentials);
      
      // Store token if provided
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // User logout
  static async logout(): Promise<{ success: boolean }> {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Optional: Call backend logout endpoint
      // await ApiHandler.post('/auth/logout');
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user info
  static async getCurrentUser(): Promise<User> {
    try {
      const response: any = await ApiHandler.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
}

export default AuthService;

