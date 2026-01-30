// authService.ts - Authentication service for FastAPI backend
import { apiClient } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  display_name?: string;
  role?: 'lawyer' | 'public';
  created_at?: number;
  last_login?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RefreshTokenResponse {
  token: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  display_name?: string;
  role?: 'lawyer' | 'public';
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;
  private tokenExpiry: number | null = null;
  private refreshTimeout: NodeJS.Timeout | null = null;

  // Set token (from login/registration)
  setToken(token: string, expiresIn: number = 3600) {
    this.token = token;
    // Set expiry time (default 1 hour from now)
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiry', this.tokenExpiry.toString());
    
    // Schedule token refresh 1 minute before expiry
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    
    // Refresh 1 minute before expiry
    const refreshTime = (expiresIn - 60) * 1000;
    if (refreshTime > 0) {
      this.refreshTimeout = setTimeout(() => {
        this.refreshToken();
      }, refreshTime);
    }
  }

  // Get token (for API requests)
  getToken(): string | null {
    if (this.token && this.tokenExpiry) {
      // Check if token is expired
      if (Date.now() > this.tokenExpiry) {
        this.clearAuth();
        return null;
      }
      return this.token;
    }
    
    // Check localStorage for token
    const storedToken = localStorage.getItem('authToken');
    const storedExpiry = localStorage.getItem('tokenExpiry');
    
    if (storedToken && storedExpiry) {
      const expiry = parseInt(storedExpiry, 10);
      // Check if token is expired
      if (Date.now() > expiry) {
        this.clearAuth();
        return null;
      }
      
      this.token = storedToken;
      this.tokenExpiry = expiry;
      return storedToken;
    }
    
    return null;
  }

  // Set user data
  setUser(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get user data
  getUser(): User | null {
    if (this.user) {
      return this.user;
    }
    
    // Check localStorage for user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        return this.user;
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        this.clearAuth();
        return null;
      }
    }
    
    return null;
  }

  // Clear auth data (logout)
  clearAuth() {
    this.token = null;
    this.user = null;
    this.tokenExpiry = null;
    
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('tokenExpiry');
  }

  // Refresh token
  async refreshToken(): Promise<boolean> {
    try {
      const currentToken = this.getToken();
      if (!currentToken) {
        return false;
      }
      
      const response = await apiClient.post<null, RefreshTokenResponse>(
        '/auth/refresh',
        null,
        {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        }
      );
      
      // Update token with new expiry
      this.setToken(response.token, response.expires_in);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuth();
      return false;
    }
  }

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<LoginRequest, any>(
        '/auth/login',
        credentials
      );
      
      // Backend returns 'access_token', convert to our AuthResponse format
      const token = response.access_token || response.token;
      const user = response.user;
      
      if (!token || !user) {
        throw new Error('Invalid login response: missing token or user');
      }
      
      // Token expires in 1 hour (3600 seconds)
      this.setToken(token, 3600);
      this.setUser(user);
      
      // Also store role in localStorage for quick access
      if (user.role) {
        localStorage.setItem('userRole', user.role);
      }
      
      console.log('Login successful, token stored:', token.substring(0, 20) + '...');
      
      return { user, token };
    } catch (error: any) {
      console.error('Login error:', error);
      // Re-throw the error with a more user-friendly message
      if (error.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.status === 400) {
        throw new Error('Please check your input and try again');
      } else {
        throw new Error('Login failed. Please try again later.');
      }
    }
  }

  // Register user
  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<RegisterRequest, any>(
        '/auth/register',
        credentials
      );
      
      // Backend returns 'access_token', convert to our AuthResponse format
      const token = response.access_token || response.token;
      const user = response.user;
      
      if (!token || !user) {
        throw new Error('Invalid register response: missing token or user');
      }
      
      // Token expires in 1 hour (3600 seconds)
      this.setToken(token, 3600);
      this.setUser(user);
      
      // Also store role in localStorage for quick access
      if (user.role) {
        localStorage.setItem('userRole', user.role);
      }
      
      console.log('Registration successful, token stored:', token.substring(0, 20) + '...');
      
      return { user, token };
    } catch (error: any) {
      console.error('Registration error:', error);
      // Re-throw the error with a more user-friendly message
      if (error.status === 409) {
        throw new Error('User already exists. Please try logging in.');
      } else if (error.status === 400) {
        throw new Error('Please check your input and try again');
      } else {
        throw new Error('Registration failed. Please try again later.');
      }
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        // Call logout endpoint
        await apiClient.post<null, { message: string }>(
          '/auth/logout',
          null,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local cleanup even if API call fails
    }
    
    // Always clear local auth data
    this.clearAuth();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  // Get role (lawyer or public)
  getRole(): 'lawyer' | 'public' {
    // First check if we have a user with a role
    const user = this.getUser();
    if (user && user.role) {
      return user.role;
    }
    
    // Check localStorage for role preference
    const storedRole = localStorage.getItem('userRole');
    if (storedRole === 'lawyer' || storedRole === 'public') {
      return storedRole;
    }
    
    return 'public';
  }

  // Set role
  async setRole(role: 'lawyer' | 'public'): Promise<void> {
    localStorage.setItem('userRole', role);
    
    // If we have a token, update the role on the server
    const token = this.getToken();
    if (token) {
      try {
        await apiClient.put<{ role: string }, { message: string }>(
          '/auth/user/role',
          { role },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        console.error('Failed to update role on server:', error);
        // Continue even if server update fails
      }
    }
  }

  // Refresh user data from server
  async refreshUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    
    try {
      const response = await apiClient.get<{ user: User }>(
        '/auth/user',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      this.setUser(response.user);
      return response.user;
    } catch (error: any) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, clear auth data
      if (error.status === 401) {
        this.clearAuth();
      }
      return null;
    }
  }
}

export const authService = new AuthService();