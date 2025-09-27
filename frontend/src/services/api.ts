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

  // Lucky Wheel methods
  async createLuckyWheel(data: unknown) {
    return this.post('/lucky-wheels', data);
  }

  async getLuckyWheels(page = 1, limit = 10) {
    return this.get(`/lucky-wheels?page=${page}&limit=${limit}`);
  }

  async getLuckyWheelById(id: string) {
    return this.get(`/lucky-wheels/${id}`);
  }

  async updateLuckyWheel(id: string, data: unknown) {
    return this.put(`/lucky-wheels/${id}`, data);
  }

  async deleteLuckyWheel(id: string) {
    return this.delete(`/lucky-wheels/${id}`);
  }

  async createLuckyWheelPrize(wheelId: string, data: unknown) {
    return this.post(`/lucky-wheels/${wheelId}/prizes`, data);
  }

  async getLuckyWheelPrizes(wheelId: string, page = 1, limit = 50) {
    return this.get(`/lucky-wheels/${wheelId}/prizes?page=${page}&limit=${limit}`);
  }

  async updateLuckyWheelPrize(id: string, data: unknown) {
    return this.put(`/lucky-wheels/prizes/${id}`, data);
  }

  async deleteLuckyWheelPrize(id: string) {
    return this.delete(`/lucky-wheels/prizes/${id}`);
  }

  async spinLuckyWheel(wheelId: string) {
    return this.post(`/lucky-wheels/${wheelId}/spin`);
  }

  async getWheelInfo(wheelId: string) {
    return this.get(`/lucky-wheels/${wheelId}/info`);
  }

  async getUserSpinHistory(page = 1, limit = 10, wheelId?: string) {
    const url = wheelId 
      ? `/lucky-wheels/user/history/${wheelId}?page=${page}&limit=${limit}`
      : `/lucky-wheels/user/history?page=${page}&limit=${limit}`;
    return this.get(url);
  }

  async getUserSpinStats(wheelId?: string) {
    const url = wheelId 
      ? `/lucky-wheels/user/stats/${wheelId}`
      : '/lucky-wheels/user/stats';
    return this.get(url);
  }

  // Subject methods
  async createSubject(data: unknown) {
    return this.post('/subjects', data);
  }

  async getSubjects(page = 1, limit = 10, search?: string) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    return this.get(`/subjects?${params.toString()}`);
  }

  async getSubjectById(id: string) {
    return this.get(`/subjects/${id}`);
  }

  async updateSubject(id: string, data: unknown) {
    return this.put(`/subjects/${id}`, data);
  }

  async deleteSubject(id: string) {
    return this.delete(`/subjects/${id}`);
  }

  // Lesson methods
  async createLesson(data: unknown) {
    return this.post('/lessons', data);
  }

  async getLessons(page = 1, limit = 10, subjectId?: string, search?: string) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (subjectId) params.append('subjectId', subjectId);
    if (search) params.append('search', search);
    return this.get(`/lessons?${params.toString()}`);
  }

  async getLessonById(id: string) {
    return this.get(`/lessons/${id}`);
  }

  async updateLesson(id: string, data: unknown) {
    return this.put(`/lessons/${id}`, data);
  }

  async deleteLesson(id: string) {
    return this.delete(`/lessons/${id}`);
  }

  async getLessonsBySubject(subjectId: string, page = 1, limit = 10) {
    return this.get(`/subjects/${subjectId}/lessons?page=${page}&limit=${limit}`);
  }

  // Certificate methods
  async createCertificate(data: unknown) {
    return this.post('/certificates', data);
  }

  async getCertificates(page = 1, limit = 10, gameChallengeId?: string, matchId?: string, userId?: string) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (gameChallengeId) params.append('gameChallengeId', gameChallengeId);
    if (matchId) params.append('matchId', matchId);
    if (userId) params.append('userId', userId);
    return this.get(`/certificates?${params.toString()}`);
  }

  async getCertificateById(id: string) {
    return this.get(`/certificates/${id}`);
  }

  async updateCertificate(id: string, data: unknown) {
    return this.put(`/certificates/${id}`, data);
  }

  async deleteCertificate(id: string) {
    return this.delete(`/certificates/${id}`);
  }

  async getUserCertificates(userId: string, page = 1, limit = 10) {
    return this.get(`/certificates/user/${userId}?page=${page}&limit=${limit}`);
  }

  async getCertificatesByMatch(matchId: string, page = 1, limit = 10) {
    return this.get(`/certificates/match/${matchId}?page=${page}&limit=${limit}`);
  }

  // Trade methods
  async createTrade(data: unknown) {
    return this.post('/trades', data);
  }

  async getTrades(page = 1, limit = 10, matchId?: string, itemId?: string) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (matchId) params.append('matchId', matchId);
    if (itemId) params.append('itemId', itemId);
    return this.get(`/trades?${params.toString()}`);
  }

  async getTradeById(id: string) {
    return this.get(`/trades/${id}`);
  }

  async updateTrade(id: string, data: unknown) {
    return this.put(`/trades/${id}`, data);
  }

  async deleteTrade(id: string) {
    return this.delete(`/trades/${id}`);
  }

  async getTradesByMatch(matchId: string, page = 1, limit = 10) {
    return this.get(`/trades/match/${matchId}?page=${page}&limit=${limit}`);
  }

  async getUserTrades(userId: string, page = 1, limit = 10) {
    return this.get(`/trades/user/${userId}?page=${page}&limit=${limit}`);
  }

  // House Decor methods
  async createHouseDecor(data: unknown) {
    return this.post('/house-decorations', data);
  }

  async getHouseDecorations(page = 1, limit = 10, search?: string, itemType?: string) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (itemType) params.append('itemType', itemType);
    return this.get(`/house-decorations?${params.toString()}`);
  }

  async getHouseDecorById(id: string) {
    return this.get(`/house-decorations/${id}`);
  }

  async updateHouseDecor(id: string, data: unknown) {
    return this.put(`/house-decorations/${id}`, data);
  }

  async deleteHouseDecor(id: string) {
    return this.delete(`/house-decorations/${id}`);
  }

  async getUserHouseDecorations(userId: string, page = 1, limit = 10) {
    return this.get(`/house-decorations/user/${userId}?page=${page}&limit=${limit}`);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
