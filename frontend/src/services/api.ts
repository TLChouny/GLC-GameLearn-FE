import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      
      if (response) {
        // Server responded with error status
        return {
          success: false,
          message: response.data?.message || 'Có lỗi xảy ra từ server',
          error: response.data?.error || error.message,
          errors: response.data?.errors || undefined,
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          message: 'Không thể kết nối đến server',
          error: 'Network error',
        };
      }
    }

    // Unknown error
    return {
      success: false,
      message: 'Có lỗi không xác định xảy ra',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Auth specific methods
  async login(email: string, password: string) {
    return this.post('/users/login', { email, password });
  }

  async register(userData: unknown) {
    return this.post('/users/register', userData);
  }

  async logout() {
    return this.post('/users/logout');
  }

  async refreshToken() {
    return this.post('/users/refresh');
  }

  async getCurrentUser(token?: string) {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
    return this.get('/auth/me', config);
  }

  // User methods
  async getUsers(page = 1, limit = 10) {
    return this.get(`/users?page=${page}&limit=${limit}`);
  }

  async getUserById(id: string) {
    return this.get(`/users/${id}`);
  }

  async updateUser(id: string, data: unknown) {
    return this.put(`/users/${id}`, data);
  }

  async deleteUser(id: string) {
    return this.delete(`/users/${id}`);
  }

  // Game methods
  async getGameChallenges(filters?: unknown) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters as Record<string, unknown>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.get(`/games/challenges?${params.toString()}`);
  }

  async createGameChallenge(data: unknown) {
    return this.post('/games/challenges', data);
  }

  async getMatches(userId?: string, page = 1, limit = 10) {
    const url = userId 
      ? `/games/users/${userId}/matches?page=${page}&limit=${limit}`
      : `/games/matches?page=${page}&limit=${limit}`;
    return this.get(url);
  }

  async createMatch(data: unknown) {
    return this.post('/games/matches', data);
  }

  async updateMatchStatus(matchId: string, data: unknown) {
    return this.put(`/games/matches/${matchId}/status`, data);
  }

  // Item methods
  async getItems(filters?: unknown) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters as Record<string, unknown>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return this.get(`/items/items?${params.toString()}`);
  }

  async createItem(data: unknown) {
    return this.post('/items/items', data);
  }

  async updateItem(id: string, data: unknown) {
    return this.put(`/items/items/${id}`, data);
  }

  async deleteItem(id: string) {
    return this.delete(`/items/items/${id}`);
  }

  // Ranking methods
  async getRankings(season: string, page = 1, limit = 10) {
    return this.get(`/rankings/season/${season}?page=${page}&limit=${limit}`);
  }

  async getTopRankings(season: string, limit = 10) {
    return this.get(`/rankings/top/${season}?limit=${limit}`);
  }

  async getUserRanking(userId: string, season: string) {
    return this.get(`/rankings/user/${userId}/season/${season}`);
  }

  async updateRanking(data: unknown) {
    return this.post('/rankings/update', data);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
