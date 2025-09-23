import apiService from './api';
import type {
  Trade,
  TradeWithDetails,
  CreateTradeRequest,
  UpdateTradeRequest,
  TradeQueryParams,
  TradeListResponse,
  ApiResponse
} from '../types';

class TradeService {
  // ===== TRADE CRUD =====
  async createTrade(data: CreateTradeRequest): Promise<ApiResponse<Trade>> {
    return apiService.post('/trades', data);
  }

  async getAllTrades(params?: TradeQueryParams): Promise<ApiResponse<TradeListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/trades?${queryParams.toString()}`);
  }

  async getTradeById(id: string): Promise<ApiResponse<TradeWithDetails>> {
    return apiService.get(`/trades/${id}`);
  }

  async updateTrade(id: string, data: UpdateTradeRequest): Promise<ApiResponse<Trade>> {
    return apiService.put(`/trades/${id}`, data);
  }

  async deleteTrade(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/trades/${id}`);
  }

  // ===== SPECIALIZED QUERIES =====
  async getTradesByMatch(matchId: string, params?: TradeQueryParams): Promise<ApiResponse<TradeListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/trades/match/${matchId}?${queryParams.toString()}`);
  }

  async getUserTrades(userId: string, params?: TradeQueryParams): Promise<ApiResponse<TradeListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/trades/user/${userId}?${queryParams.toString()}`);
  }

  // ===== UTILITY METHODS =====
  async getTradeHistory(matchId: string): Promise<TradeWithDetails[]> {
    try {
      const response = await this.getTradesByMatch(matchId);
      return response.data?.trades || [];
    } catch {
      return [];
    }
  }

  async getUserTradeCount(userId: string): Promise<number> {
    try {
      const response = await this.getUserTrades(userId, { limit: 1 });
      return response.data?.pagination.totalTrades || 0;
    } catch {
      return 0;
    }
  }

  async getTradesByItem(itemId: string): Promise<TradeWithDetails[]> {
    try {
      const response = await this.getAllTrades({ itemId });
      return response.data?.trades || [];
    } catch {
      return [];
    }
  }

  async searchTrades(query: string): Promise<TradeWithDetails[]> {
    try {
      const response = await this.getAllTrades({ query });
      return response.data?.trades || [];
    } catch {
      return [];
    }
  }

  // ===== VALIDATION HELPERS =====
  validateTradeData(data: CreateTradeRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.matchId) {
      errors.push('ID trận đấu là bắt buộc');
    }

    if (!data.itemTaken) {
      errors.push('ID vật phẩm được lấy là bắt buộc');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ===== ANALYTICS HELPERS =====
  async getTradeStats(userId?: string): Promise<{
    totalTrades: number;
    tradesByItem: Array<{ itemName: string; count: number }>;
    tradesByMatch: Array<{ matchId: string; count: number }>;
    recentTrades: Trade[];
  } | null> {
    try {
      const params = userId ? { userId } : {};
      const response = await this.getAllTrades(params);

      if (response.success && response.data) {
        const trades = response.data.trades;
        const totalTrades = response.data.pagination.totalTrades;

        // Group by item
        const itemMap = new Map<string, number>();
        trades.forEach(trade => {
          if (trade.itemTaken) {
            const itemName = trade.itemTaken.itemName;
            itemMap.set(itemName, (itemMap.get(itemName) || 0) + 1);
          }
        });

        const tradesByItem = Array.from(itemMap.entries()).map(([itemName, count]) => ({
          itemName,
          count
        }));

        // Group by match
        const matchMap = new Map<string, number>();
        trades.forEach(trade => {
          const matchId = trade.matchId._id;
          matchMap.set(matchId, (matchMap.get(matchId) || 0) + 1);
        });

        const tradesByMatch = Array.from(matchMap.entries()).map(([matchId, count]) => ({
          matchId,
          count
        }));

        // Get recent trades (last 10)
        const recentTrades = trades
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);

        return {
          totalTrades,
          tradesByItem,
          tradesByMatch,
          recentTrades: recentTrades as unknown as Trade[]
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  // ===== BUSINESS LOGIC HELPERS =====
  async canUserTradeItem(userId: string, itemId: string): Promise<boolean> {
    try {
      // Check if user owns the item
      const userTrades = await this.getUserTrades(userId);
      if (userTrades.success && userTrades.data) {
        const userOwnsItem = userTrades.data.trades.some(trade => 
          trade.itemTaken._id === itemId && trade.matchId.status === 'completed'
        );
        return userOwnsItem;
      }
      return false;
    } catch {
      return false;
    }
  }

  async getItemTradeHistory(itemId: string): Promise<TradeWithDetails[]> {
    try {
      const response = await this.getTradesByItem(itemId);
      return response || [];
    } catch {
      return [];
    }
  }
}

// Create singleton instance
const tradeService = new TradeService();

export default tradeService;
