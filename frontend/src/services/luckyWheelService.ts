import apiService from './api';
import type {
  LuckyWheel,
  LuckyWheelWithPrizes,
  LuckyWheelPrize,
  SpinResult,
  WheelInfo,
  SpinStats,
  CreateLuckyWheelRequest,
  UpdateLuckyWheelRequest,
  CreateLuckyWheelPrizeRequest,
  UpdateLuckyWheelPrizeRequest,
  LuckyWheelListResponse,
  LuckyWheelPrizeListResponse,
  LuckyWheelSpinHistoryResponse,
  LuckyWheelQueryParams,
  LuckyWheelPrizeQueryParams,
  LuckyWheelSpinQueryParams,
  ApiResponse
} from '../types';

class LuckyWheelService {
  // ===== LUCKY WHEEL CRUD =====
  async createLuckyWheel(data: CreateLuckyWheelRequest): Promise<ApiResponse<LuckyWheel>> {
    return apiService.post('/lucky-wheels', data);
  }

  async getAllLuckyWheels(params?: LuckyWheelQueryParams): Promise<ApiResponse<LuckyWheelListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/lucky-wheels?${queryParams.toString()}`);
  }

  async getLuckyWheelById(id: string): Promise<ApiResponse<LuckyWheel>> {
    return apiService.get(`/lucky-wheels/${id}`);
  }

  async updateLuckyWheel(id: string, data: UpdateLuckyWheelRequest): Promise<ApiResponse<LuckyWheel>> {
    return apiService.put(`/lucky-wheels/${id}`, data);
  }

  async deleteLuckyWheel(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/lucky-wheels/${id}`);
  }

  // ===== LUCKY WHEEL PRIZE CRUD =====
  async createLuckyWheelPrize(wheelId: string, data: CreateLuckyWheelPrizeRequest): Promise<ApiResponse<LuckyWheelPrize>> {
    return apiService.post(`/lucky-wheels/${wheelId}/prizes`, data);
  }

  async getLuckyWheelPrizes(wheelId: string, params?: LuckyWheelPrizeQueryParams): Promise<ApiResponse<LuckyWheelPrizeListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/lucky-wheels/${wheelId}/prizes?${queryParams.toString()}`);
  }

  async updateLuckyWheelPrize(id: string, data: UpdateLuckyWheelPrizeRequest): Promise<ApiResponse<LuckyWheelPrize>> {
    return apiService.put(`/lucky-wheels/prizes/${id}`, data);
  }

  async deleteLuckyWheelPrize(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/lucky-wheels/prizes/${id}`);
  }

  // ===== LUCKY WHEEL SPIN OPERATIONS =====
  async spinLuckyWheel(wheelId: string): Promise<ApiResponse<SpinResult>> {
    return apiService.post(`/lucky-wheels/${wheelId}/spin`);
  }

  async getWheelInfo(wheelId: string): Promise<ApiResponse<WheelInfo>> {
    return apiService.get(`/lucky-wheels/${wheelId}/info`);
  }

  async getUserSpinHistory(params?: LuckyWheelSpinQueryParams): Promise<ApiResponse<LuckyWheelSpinHistoryResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/lucky-wheels/user/history?${queryParams.toString()}`);
  }

  async getUserSpinHistoryByWheel(wheelId: string, params?: LuckyWheelSpinQueryParams): Promise<ApiResponse<LuckyWheelSpinHistoryResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/lucky-wheels/user/history/${wheelId}?${queryParams.toString()}`);
  }

  async getUserSpinStats(): Promise<ApiResponse<SpinStats>> {
    return apiService.get('/lucky-wheels/user/stats');
  }

  async getUserSpinStatsByWheel(wheelId: string): Promise<ApiResponse<SpinStats>> {
    return apiService.get(`/lucky-wheels/user/stats/${wheelId}`);
  }

  // ===== UTILITY METHODS =====
  async canUserSpin(wheelId: string): Promise<boolean> {
    try {
      const response = await this.getWheelInfo(wheelId);
      return response.data?.canSpin || false;
    } catch {
      return false;
    }
  }

  async getRemainingSpins(wheelId: string): Promise<number> {
    try {
      const response = await this.getWheelInfo(wheelId);
      return response.data?.remainingSpins || 0;
    } catch {
      return 0;
    }
  }

  async getWheelWithPrizes(wheelId: string): Promise<LuckyWheelWithPrizes | null> {
    try {
      const [wheelResponse, prizesResponse] = await Promise.all([
        this.getLuckyWheelById(wheelId),
        this.getLuckyWheelPrizes(wheelId)
      ]);

      if (wheelResponse.success && prizesResponse.success) {
        return {
          ...wheelResponse.data!,
          prizes: prizesResponse.data!.prizes
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  // ===== VALIDATION HELPERS =====
  validatePrizeProbability(prizes: LuckyWheelPrize[]): boolean {
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    return Math.abs(totalProbability - 100) < 0.01;
  }

  calculatePrizeDistribution(prizes: LuckyWheelPrize[]): Array<{ prize: LuckyWheelPrize; cumulativeProbability: number }> {
    let cumulativeProbability = 0;
    return prizes.map(prize => {
      cumulativeProbability += prize.probability;
      return {
        prize,
        cumulativeProbability
      };
    });
  }

  // ===== ANALYTICS HELPERS =====
  async getWheelAnalytics(wheelId: string): Promise<{
    totalSpins: number;
    prizeDistribution: Array<{ prizeName: string; count: number; percentage: number }>;
    dailySpins: Array<{ date: string; count: number }>;
  } | null> {
    try {
      const [statsResponse, historyResponse] = await Promise.all([
        this.getUserSpinStatsByWheel(wheelId),
        this.getUserSpinHistoryByWheel(wheelId, { limit: 1000 })
      ]);

      if (statsResponse.success && historyResponse.success) {
        const totalSpins = statsResponse.data!.totalSpins;
        const prizeStats = statsResponse.data!.prizeStats;
        
        const prizeDistribution = prizeStats.map(stat => ({
          prizeName: stat._id,
          count: stat.count,
          percentage: totalSpins > 0 ? (stat.count / totalSpins) * 100 : 0
        }));

        // Calculate daily spins from history
        const dailySpinsMap = new Map<string, number>();
        historyResponse.data!.spinHistory.forEach(spin => {
          const date = new Date(spin.createdAt).toISOString().split('T')[0];
          dailySpinsMap.set(date, (dailySpinsMap.get(date) || 0) + 1);
        });

        const dailySpins = Array.from(dailySpinsMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        return {
          totalSpins,
          prizeDistribution,
          dailySpins
        };
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Create singleton instance
const luckyWheelService = new LuckyWheelService();

export default luckyWheelService;
