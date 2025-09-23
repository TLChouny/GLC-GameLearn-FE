import apiService from './api';
import type {
  Ranking,
  RankingWithUser,
  CreateRankingRequest,
  UpdateRankingRequest,
  RankingListResponse,
  RankingStatsResponse,
  RankingQueryParams,
  LeaderboardResponse,
  Season,
  SeasonResponse,
  RankingProgress,
  RankingProgressResponse,
  RankingComparison,
  RankingComparisonResponse,
  ApiResponse
} from '../types';

const BASE_URL = '/rankings';

export const rankingService = {
  // ===== RANKING CRUD =====
  createRanking: async (data: CreateRankingRequest): Promise<ApiResponse<Ranking>> => {
    return apiService.post(`${BASE_URL}`, data);
  },

  getAllRankings: async (params?: RankingQueryParams): Promise<ApiResponse<RankingListResponse>> => {
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

  getRankingById: async (id: string): Promise<ApiResponse<RankingWithUser>> => {
    return apiService.get(`${BASE_URL}/${id}`);
  },

  updateRanking: async (id: string, data: UpdateRankingRequest): Promise<ApiResponse<Ranking>> => {
    return apiService.put(`${BASE_URL}/${id}`, data);
  },

  deleteRanking: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete(`${BASE_URL}/${id}`);
  },

  // ===== RANKING OPERATIONS =====
  updateUserRanking: async (data: {
    userId: string;
    totalPoints: number;
    season: string;
  }): Promise<ApiResponse<Ranking>> => {
    return apiService.post(`${BASE_URL}/update`, data);
  },

  updateAllRankings: async (season: string): Promise<ApiResponse<{
    updated: number;
    message: string;
  }>> => {
    return apiService.post(`${BASE_URL}/update-all`, { season });
  },

  // ===== RANKING BY SEASON =====
  getRankingsBySeason: async (season: string, page: number = 1, limit: number = 10): Promise<ApiResponse<RankingListResponse>> => {
    return apiService.get(`${BASE_URL}/season/${season}?page=${page}&limit=${limit}`);
  },

  getTopRankings: async (season: string, limit: number = 10): Promise<ApiResponse<RankingWithUser[]>> => {
    return apiService.get(`${BASE_URL}/top/${season}?limit=${limit}`);
  },

  getUserRanking: async (userId: string, season: string): Promise<ApiResponse<RankingWithUser>> => {
    return apiService.get(`${BASE_URL}/user/${userId}/season/${season}`);
  },

  // ===== SEASONS =====
  getAllSeasons: async (): Promise<ApiResponse<SeasonResponse>> => {
    return apiService.get(`${BASE_URL}/seasons`);
  },

  createSeason: async (data: {
    name: string;
    startDate: string;
    endDate: string;
    description?: string;
  }): Promise<ApiResponse<Season>> => {
    return apiService.post(`${BASE_URL}/seasons`, data);
  },

  updateSeason: async (id: string, data: {
    name?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<Season>> => {
    return apiService.put(`${BASE_URL}/seasons/${id}`, data);
  },

  deleteSeason: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete(`${BASE_URL}/seasons/${id}`);
  },

  // ===== LEADERBOARD =====
  getLeaderboard: async (season: string): Promise<ApiResponse<LeaderboardResponse>> => {
    return apiService.get(`${BASE_URL}/leaderboard/${season}`);
  },

  getCurrentLeaderboard: async (): Promise<ApiResponse<LeaderboardResponse>> => {
    return apiService.get(`${BASE_URL}/leaderboard/current`);
  },

  // ===== RANKING PROGRESS =====
  getRankingProgress: async (userId: string, season: string): Promise<ApiResponse<RankingProgress>> => {
    return apiService.get(`${BASE_URL}/progress/${userId}/${season}`);
  },

  getAllRankingProgress: async (season: string): Promise<ApiResponse<RankingProgressResponse>> => {
    return apiService.get(`${BASE_URL}/progress/all/${season}`);
  },

  // ===== RANKING COMPARISON =====
  getRankingComparison: async (userId: string, currentSeason: string, previousSeason?: string): Promise<ApiResponse<RankingComparison>> => {
    const params = previousSeason ? `?previousSeason=${previousSeason}` : '';
    return apiService.get(`${BASE_URL}/comparison/${userId}/${currentSeason}${params}`);
  },

  getAllRankingComparisons: async (currentSeason: string, previousSeason?: string): Promise<ApiResponse<RankingComparisonResponse>> => {
    const params = previousSeason ? `?previousSeason=${previousSeason}` : '';
    return apiService.get(`${BASE_URL}/comparison/all/${currentSeason}${params}`);
  },

  // ===== RANKING STATISTICS =====
  getRankingStats: async (): Promise<ApiResponse<RankingStatsResponse>> => {
    return apiService.get(`${BASE_URL}/stats`);
  },

  getSeasonStats: async (season: string): Promise<ApiResponse<{
    totalPlayers: number;
    averagePoints: number;
    highestPoints: number;
    lowestPoints: number;
    rankDistribution: Array<{
      rankRange: string;
      count: number;
    }>;
  }>> => {
    return apiService.get(`${BASE_URL}/stats/season/${season}`);
  },

  // ===== USER RANKING HISTORY =====
  getUserRankingHistory: async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<RankingListResponse>> => {
    return apiService.get(`${BASE_URL}/user/${userId}/history?page=${page}&limit=${limit}`);
  },

  getUserBestRanking: async (userId: string): Promise<ApiResponse<RankingWithUser>> => {
    return apiService.get(`${BASE_URL}/user/${userId}/best`);
  },

  getUserCurrentRanking: async (userId: string): Promise<ApiResponse<RankingWithUser>> => {
    return apiService.get(`${BASE_URL}/user/${userId}/current`);
  },

  // ===== RANKING ANALYTICS =====
  getRankingAnalytics: async (): Promise<ApiResponse<{
    totalSeasons: number;
    totalPlayers: number;
    averagePoints: number;
    mostCompetitiveSeason: string;
    topPerformers: Array<{
      userId: string;
      userName: string;
      totalPoints: number;
      bestRank: number;
    }>;
  }>> => {
    return apiService.get(`${BASE_URL}/analytics`);
  },

  getSeasonAnalytics: async (season: string): Promise<ApiResponse<{
    totalPlayers: number;
    averagePoints: number;
    highestPoints: number;
    lowestPoints: number;
    rankDistribution: Array<{
      rankRange: string;
      count: number;
    }>;
    topPerformers: Array<{
      userId: string;
      userName: string;
      totalPoints: number;
      rank: number;
    }>;
  }>> => {
    return apiService.get(`${BASE_URL}/analytics/season/${season}`);
  },

  // ===== UTILITY METHODS =====
  getRankDisplay: (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  },

  getRankColor: (rank: number): string => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    if (rank <= 10) return '#4CAF50';
    if (rank <= 50) return '#2196F3';
    if (rank <= 100) return '#FF9800';
    return '#9E9E9E';
  },

  getRankLabel: (rank: number): string => {
    if (rank === 1) return 'Hạng 1';
    if (rank === 2) return 'Hạng 2';
    if (rank === 3) return 'Hạng 3';
    return `Hạng ${rank}`;
  },

  formatPoints: (points: number): string => {
    return new Intl.NumberFormat('vi-VN').format(points);
  },

  calculateRankChange: (currentRank: number, previousRank: number): {
    change: number;
    direction: 'up' | 'down' | 'same';
    label: string;
  } => {
    const change = previousRank - currentRank;
    let direction: 'up' | 'down' | 'same' = 'same';
    let label = 'Không đổi';

    if (change > 0) {
      direction = 'up';
      label = `Tăng ${change} hạng`;
    } else if (change < 0) {
      direction = 'down';
      label = `Giảm ${Math.abs(change)} hạng`;
    }

    return { change, direction, label };
  },

  calculatePointsChange: (currentPoints: number, previousPoints: number): {
    change: number;
    direction: 'up' | 'down' | 'same';
    label: string;
  } => {
    const change = currentPoints - previousPoints;
    let direction: 'up' | 'down' | 'same' = 'same';
    let label = 'Không đổi';

    if (change > 0) {
      direction = 'up';
      label = `+${rankingService.formatPoints(change)} điểm`;
    } else if (change < 0) {
      direction = 'down';
      label = `${rankingService.formatPoints(change)} điểm`;
    }

    return { change, direction, label };
  },

  getSeasonStatus: (season: Season): 'upcoming' | 'active' | 'ended' => {
    const now = new Date();
    const startDate = new Date(season.startDate);
    const endDate = new Date(season.endDate);

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'ended';
    return 'active';
  },

  getSeasonStatusColor: (status: 'upcoming' | 'active' | 'ended'): string => {
    switch (status) {
      case 'upcoming': return '#2196F3';
      case 'active': return '#4CAF50';
      case 'ended': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  },

  getSeasonStatusLabel: (status: 'upcoming' | 'active' | 'ended'): string => {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'active': return 'Đang diễn ra';
      case 'ended': return 'Đã kết thúc';
      default: return 'Không xác định';
    }
  },

  // ===== VALIDATION HELPERS =====
  validateRankingData: (data: CreateRankingRequest | UpdateRankingRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if ('userId' in data && data.userId) {
      if (!data.userId.trim()) {
        errors.push('ID người dùng không được để trống');
      }
    }

    if ('totalPoints' in data && data.totalPoints !== undefined) {
      if (data.totalPoints < 0) {
        errors.push('Tổng điểm không được âm');
      }
    }

    if ('rank' in data && data.rank !== undefined) {
      if (data.rank < 1) {
        errors.push('Hạng phải lớn hơn 0');
      }
    }

    if ('season' in data && data.season) {
      if (!data.season.trim()) {
        errors.push('Mùa giải không được để trống');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateSeasonData: (data: {
    name: string;
    startDate: string;
    endDate: string;
    description?: string;
  }): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.name.trim()) {
      errors.push('Tên mùa giải không được để trống');
    }

    if (!data.startDate) {
      errors.push('Ngày bắt đầu không được để trống');
    }

    if (!data.endDate) {
      errors.push('Ngày kết thúc không được để trống');
    }

    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      if (startDate >= endDate) {
        errors.push('Ngày kết thúc phải sau ngày bắt đầu');
      }
    }

    if (data.description && data.description.length > 500) {
      errors.push('Mô tả không được quá 500 ký tự');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
