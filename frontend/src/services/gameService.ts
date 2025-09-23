import apiService from './api';
import type {
  GameChallenge,
  GameChallengeWithSubject,
  CreateGameChallengeRequest,
  UpdateGameChallengeRequest,
  GameChallengeListResponse,
  GameChallengeStatsResponse,
  GameChallengeQueryParams,
  Match,
  MatchWithDetails,
  CreateMatchRequest,
  UpdateMatchStatusRequest,
  MatchListResponse,
  MatchQueryParams,
  Certificate,
  CertificateWithDetails,
  CreateCertificateRequest,
  UpdateCertificateRequest,
  CertificateListResponse,
  CertificateQueryParams,
  ApiResponse
} from '../types';

const BASE_URL = '/games';

export const gameService = {
  // ===== GAME CHALLENGE CRUD =====
  createGameChallenge: async (data: CreateGameChallengeRequest): Promise<ApiResponse<GameChallenge>> => {
    return apiService.post(`${BASE_URL}/challenges`, data);
  },

  getAllGameChallenges: async (params?: GameChallengeQueryParams): Promise<ApiResponse<GameChallengeListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`${BASE_URL}/challenges?${queryParams.toString()}`);
  },

  getGameChallengeById: async (id: string): Promise<ApiResponse<GameChallengeWithSubject>> => {
    return apiService.get(`${BASE_URL}/challenges/${id}`);
  },

  updateGameChallenge: async (id: string, data: UpdateGameChallengeRequest): Promise<ApiResponse<GameChallenge>> => {
    return apiService.put(`${BASE_URL}/challenges/${id}`, data);
  },

  deleteGameChallenge: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete(`${BASE_URL}/challenges/${id}`);
  },

  // ===== GAME CHALLENGE STATS =====
  getGameChallengeStats: async (): Promise<ApiResponse<GameChallengeStatsResponse>> => {
    return apiService.get(`${BASE_URL}/challenges/stats`);
  },

  getGameChallengesBySubject: async (subjectId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<GameChallengeListResponse>> => {
    return apiService.get(`${BASE_URL}/challenges/subject/${subjectId}?page=${page}&limit=${limit}`);
  },

  getGameChallengesByDifficulty: async (difficulty: 'easy' | 'medium' | 'hard', page: number = 1, limit: number = 10): Promise<ApiResponse<GameChallengeListResponse>> => {
    return apiService.get(`${BASE_URL}/challenges/difficulty/${difficulty}?page=${page}&limit=${limit}`);
  },

  // ===== MATCH CRUD =====
  createMatch: async (data: CreateMatchRequest): Promise<ApiResponse<Match>> => {
    return apiService.post(`${BASE_URL}/matches`, data);
  },

  getAllMatches: async (params?: MatchQueryParams): Promise<ApiResponse<MatchListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`${BASE_URL}/matches?${queryParams.toString()}`);
  },

  getMatchById: async (id: string): Promise<ApiResponse<MatchWithDetails>> => {
    return apiService.get(`${BASE_URL}/matches/${id}`);
  },

  updateMatchStatus: async (id: string, data: UpdateMatchStatusRequest): Promise<ApiResponse<Match>> => {
    return apiService.put(`${BASE_URL}/matches/${id}/status`, data);
  },

  deleteMatch: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete(`${BASE_URL}/matches/${id}`);
  },

  // ===== USER MATCHES =====
  getUserMatches: async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<MatchListResponse>> => {
    return apiService.get(`${BASE_URL}/users/${userId}/matches?page=${page}&limit=${limit}`);
  },

  getUserActiveMatches: async (userId: string): Promise<ApiResponse<Match[]>> => {
    return apiService.get(`${BASE_URL}/users/${userId}/matches/active`);
  },

  getUserMatchHistory: async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<MatchListResponse>> => {
    return apiService.get(`${BASE_URL}/users/${userId}/matches/history?page=${page}&limit=${limit}`);
  },

  // ===== MATCH OPERATIONS =====
  joinMatch: async (matchId: string): Promise<ApiResponse<Match>> => {
    return apiService.post(`${BASE_URL}/matches/${matchId}/join`);
  },

  leaveMatch: async (matchId: string): Promise<ApiResponse<Match>> => {
    return apiService.post(`${BASE_URL}/matches/${matchId}/leave`);
  },

  startMatch: async (matchId: string): Promise<ApiResponse<Match>> => {
    return apiService.post(`${BASE_URL}/matches/${matchId}/start`);
  },

  endMatch: async (matchId: string, winnerId: string, loserId: string): Promise<ApiResponse<Match>> => {
    return apiService.post(`${BASE_URL}/matches/${matchId}/end`, { winnerId, loserId });
  },

  // ===== CERTIFICATE CRUD =====
  createCertificate: async (data: CreateCertificateRequest): Promise<ApiResponse<Certificate>> => {
    return apiService.post(`${BASE_URL}/certificates`, data);
  },

  getAllCertificates: async (params?: CertificateQueryParams): Promise<ApiResponse<CertificateListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`${BASE_URL}/certificates?${queryParams.toString()}`);
  },

  getCertificateById: async (id: string): Promise<ApiResponse<CertificateWithDetails>> => {
    return apiService.get(`${BASE_URL}/certificates/${id}`);
  },

  updateCertificate: async (id: string, data: UpdateCertificateRequest): Promise<ApiResponse<Certificate>> => {
    return apiService.put(`${BASE_URL}/certificates/${id}`, data);
  },

  deleteCertificate: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete(`${BASE_URL}/certificates/${id}`);
  },

  // ===== USER CERTIFICATES =====
  getUserCertificates: async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<CertificateListResponse>> => {
    return apiService.get(`${BASE_URL}/users/${userId}/certificates?page=${page}&limit=${limit}`);
  },

  getCertificatesByGameChallenge: async (gameChallengeId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<CertificateListResponse>> => {
    return apiService.get(`${BASE_URL}/certificates/challenge/${gameChallengeId}?page=${page}&limit=${limit}`);
  },

  getCertificatesByMatch: async (matchId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<CertificateListResponse>> => {
    return apiService.get(`${BASE_URL}/certificates/match/${matchId}?page=${page}&limit=${limit}`);
  },

  // ===== GAME ANALYTICS =====
  getGameAnalytics: async (): Promise<ApiResponse<{
    totalChallenges: number;
    totalMatches: number;
    totalCertificates: number;
    averageMatchDuration: number;
    popularChallenges: GameChallenge[];
    topPlayers: Array<{
      userId: string;
      userName: string;
      wins: number;
      totalMatches: number;
    }>;
  }>> => {
    return apiService.get(`${BASE_URL}/analytics`);
  },

  getChallengeAnalytics: async (challengeId: string): Promise<ApiResponse<{
    totalMatches: number;
    totalPlayers: number;
    averageScore: number;
    completionRate: number;
    difficulty: string;
  }>> => {
    return apiService.get(`${BASE_URL}/challenges/${challengeId}/analytics`);
  },

  // ===== UTILITY METHODS =====
  getDifficultyColor: (difficulty: 'easy' | 'medium' | 'hard'): string => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#9E9E9E';
    }
  },

  getDifficultyLabel: (difficulty: 'easy' | 'medium' | 'hard'): string => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return 'Không xác định';
    }
  },

  getStatusColor: (status: 'waiting' | 'ongoing' | 'completed' | 'cancelled'): string => {
    switch (status) {
      case 'waiting': return '#2196F3';
      case 'ongoing': return '#FF9800';
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  },

  getStatusLabel: (status: 'waiting' | 'ongoing' | 'completed' | 'cancelled'): string => {
    switch (status) {
      case 'waiting': return 'Chờ';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  },

  formatMatchDuration: (startTime: string, endTime: string): string => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = end.getTime() - start.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  // ===== VALIDATION HELPERS =====
  validateGameChallengeData: (data: CreateGameChallengeRequest | UpdateGameChallengeRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if ('title' in data && data.title) {
      if (data.title.length < 3) {
        errors.push('Tiêu đề phải có ít nhất 3 ký tự');
      }
      if (data.title.length > 100) {
        errors.push('Tiêu đề không được quá 100 ký tự');
      }
    }

    if ('difficulty' in data && data.difficulty) {
      if (!['easy', 'medium', 'hard'].includes(data.difficulty)) {
        errors.push('Độ khó không hợp lệ');
      }
    }

    if ('rewardPoints' in data && data.rewardPoints !== undefined) {
      if (data.rewardPoints < 0) {
        errors.push('Điểm thưởng không được âm');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateMatchData: (data: CreateMatchRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.players || data.players.length === 0) {
      errors.push('Phải có ít nhất 1 người chơi');
    }

    if (data.players && data.players.length > 4) {
      errors.push('Không được quá 4 người chơi');
    }

    if (!data.gameChallengeId) {
      errors.push('Phải chọn thử thách game');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
