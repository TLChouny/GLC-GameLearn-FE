import apiService from './api';
import type {
  User,
  UserWithDetails,
  CreateUserRequest,
  UpdateUserRequest,
  UserListResponse,
  UserStatsResponse,
  UserQueryParams,
  ApiResponse
} from '../types';

const BASE_URL = '/users';

export const userService = {
  // ===== USER CRUD =====
  createUser: async (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    return apiService.post(`${BASE_URL}`, data);
  },

  getAllUsers: async (params?: UserQueryParams): Promise<ApiResponse<UserListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`${BASE_URL}?${queryParams.toString()}`);
  },

  getUserById: async (id: string): Promise<ApiResponse<UserWithDetails>> => {
    return apiService.get(`${BASE_URL}/${id}`);
  },

  updateUser: async (id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return apiService.put(`${BASE_URL}/${id}`, data);
  },

  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete(`${BASE_URL}/${id}`);
  },

  // ===== USER FRIENDSHIP =====
  addFriend: async (friendId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post(`${BASE_URL}/add-friend`, { friendId });
  },

  removeFriend: async (friendId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiService.delete(`${BASE_URL}/friends/${friendId}`);
  },

  getFriends: async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<UserListResponse>> => {
    return apiService.get(`${BASE_URL}/${userId}/friends?page=${page}&limit=${limit}`);
  },

  // ===== USER POINTS =====
  updateUserPoints: async (id: string, points: number): Promise<ApiResponse<User>> => {
    return apiService.put(`${BASE_URL}/${id}/points`, { points });
  },

  addPoints: async (id: string, points: number): Promise<ApiResponse<User>> => {
    return apiService.post(`${BASE_URL}/${id}/points`, { points });
  },

  deductPoints: async (id: string, points: number): Promise<ApiResponse<User>> => {
    return apiService.post(`${BASE_URL}/${id}/points/deduct`, { points });
  },

  // ===== USER STATS =====
  getUserStats: async (id: string): Promise<ApiResponse<{
    gamesPlayed: number;
    gamesWon: number;
    totalScore: number;
    averageScore: number;
    winRate: number;
    rank: number;
  }>> => {
    return apiService.get(`${BASE_URL}/${id}/stats`);
  },

  updateUserStats: async (id: string, stats: {
    gamesPlayed?: number;
    gamesWon?: number;
    totalScore?: number;
    averageScore?: number;
  }): Promise<ApiResponse<User>> => {
    return apiService.put(`${BASE_URL}/${id}/stats`, stats);
  },

  // ===== USER PROFILE =====
  updateProfile: async (id: string, data: {
    userName?: string;
    avatar?: string;
    userDescription?: string;
    address?: string;
  }): Promise<ApiResponse<User>> => {
    return apiService.put(`${BASE_URL}/${id}/profile`, data);
  },

  uploadAvatar: async (id: string, file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiService.post(`${BASE_URL}/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // ===== USER ACTIVITY =====
  getUserActivity: async (id: string, page: number = 1, limit: number = 10): Promise<ApiResponse<{
    activities: Array<{
      type: string;
      description: string;
      timestamp: string;
      data?: unknown;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalActivities: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>> => {
    return apiService.get(`${BASE_URL}/${id}/activity?page=${page}&limit=${limit}`);
  },

  // ===== USER SEARCH =====
  searchUsers: async (query: string, page: number = 1, limit: number = 10): Promise<ApiResponse<UserListResponse>> => {
    return apiService.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  // ===== USER VALIDATION =====
  checkUserNameAvailability: async (userName: string): Promise<ApiResponse<{ available: boolean }>> => {
    return apiService.get(`${BASE_URL}/check-username?userName=${encodeURIComponent(userName)}`);
  },

  checkEmailAvailability: async (email: string): Promise<ApiResponse<{ available: boolean }>> => {
    return apiService.get(`${BASE_URL}/check-email?email=${encodeURIComponent(email)}`);
  },

  // ===== USER STATISTICS =====
  getUserStatistics: async (): Promise<ApiResponse<UserStatsResponse>> => {
    return apiService.get(`${BASE_URL}/statistics`);
  },

  getTopUsers: async (limit: number = 10): Promise<ApiResponse<User[]>> => {
    return apiService.get(`${BASE_URL}/top?limit=${limit}`);
  },

  getUsersByRole: async (role: 'student' | 'admin' | 'teacher', page: number = 1, limit: number = 10): Promise<ApiResponse<UserListResponse>> => {
    return apiService.get(`${BASE_URL}/role/${role}?page=${page}&limit=${limit}`);
  },

  // ===== USER BULK OPERATIONS =====
  bulkUpdateUsers: async (updates: Array<{
    id: string;
    data: UpdateUserRequest;
  }>): Promise<ApiResponse<{ updated: number; failed: number }>> => {
    return apiService.post(`${BASE_URL}/bulk-update`, { updates });
  },

  bulkDeleteUsers: async (userIds: string[]): Promise<ApiResponse<{ deleted: number; failed: number }>> => {
    return apiService.post(`${BASE_URL}/bulk-delete`, { userIds });
  },

  // ===== UTILITY METHODS =====
  getUserDisplayName: (user: User): string => {
    return user.userName || user.email.split('@')[0];
  },

  getUserInitials: (user: User): string => {
    const name = userService.getUserDisplayName(user);
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  },

  formatUserStats: (stats: { gamesPlayed: number; gamesWon: number; winRate: number }): string => {
    return `Games: ${stats.gamesPlayed} | Wins: ${stats.gamesWon} | Win Rate: ${(stats.winRate * 100).toFixed(1)}%`;
  },

  // ===== VALIDATION HELPERS =====
  validateUserData: (data: CreateUserRequest | UpdateUserRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if ('userName' in data && data.userName) {
      if (data.userName.length < 3) {
        errors.push('Tên người dùng phải có ít nhất 3 ký tự');
      }
      if (data.userName.length > 30) {
        errors.push('Tên người dùng không được quá 30 ký tự');
      }
    }

    if ('email' in data && data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Email không hợp lệ');
      }
    }

    if ('password' in data && data.password) {
      if (data.password.length < 6) {
        errors.push('Mật khẩu phải có ít nhất 6 ký tự');
      }
    }

    if ('gender' in data && data.gender) {
      if (!['male', 'female', 'other'].includes(data.gender)) {
        errors.push('Giới tính không hợp lệ');
      }
    }

    if ('role' in data && data.role) {
      if (!['student', 'admin', 'teacher'].includes(data.role)) {
        errors.push('Vai trò không hợp lệ');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
