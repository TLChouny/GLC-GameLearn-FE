import apiService from './api';
import type {
  HouseDecoration,
  HouseDecorationWithItems,
  CreateHouseDecorationRequest,
  HouseDecorationListResponse,
  HouseDecorationFilters,
  ApiResponse
} from '../types';

class HouseDecorService {
  // ===== HOUSE DECOR CRUD =====
  async createHouseDecor(data: CreateHouseDecorationRequest): Promise<ApiResponse<HouseDecoration>> {
    return apiService.post('/house-decorations', data);
  }

  async getAllHouseDecorations(params?: HouseDecorationFilters): Promise<ApiResponse<HouseDecorationListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/house-decorations?${queryParams.toString()}`);
  }

  async getHouseDecorById(id: string): Promise<ApiResponse<HouseDecorationWithItems>> {
    return apiService.get(`/house-decorations/${id}`);
  }

  async updateHouseDecor(id: string, data: CreateHouseDecorationRequest): Promise<ApiResponse<HouseDecoration>> {
    return apiService.put(`/house-decorations/${id}`, data);
  }

  async deleteHouseDecor(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/house-decorations/${id}`);
  }

  // ===== SPECIALIZED QUERIES =====
  async getUserHouseDecorations(userId: string, params?: HouseDecorationFilters): Promise<ApiResponse<HouseDecorationListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/house-decorations/user/${userId}?${queryParams.toString()}`);
  }

  // ===== UTILITY METHODS =====
  async searchHouseDecorations(query: string): Promise<HouseDecorationWithItems[]> {
    try {
      const response = await this.getAllHouseDecorations({ search: query });
      return response.data?.houseDecorations || [];
    } catch {
      return [];
    }
  }

  async getHouseDecorationsByItemType(itemType: string): Promise<HouseDecorationWithItems[]> {
    try {
      const response = await this.getAllHouseDecorations({ itemType });
      return response.data?.houseDecorations || [];
    } catch {
      return [];
    }
  }

  async getUserHouseDecorCount(userId: string): Promise<number> {
    try {
      const response = await this.getUserHouseDecorations(userId, { limit: 1 });
      return response.data?.pagination.totalDecorations || 0;
    } catch {
      return 0;
    }
  }

  async getHouseDecorWithItems(id: string): Promise<HouseDecorationWithItems | null> {
    try {
      const response = await this.getHouseDecorById(id);
      return response.data || null;
    } catch {
      return null;
    }
  }

  // ===== VALIDATION HELPERS =====
  validateHouseDecorData(data: CreateHouseDecorationRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.houseName || data.houseName.trim().length === 0) {
      errors.push('Tên nhà là bắt buộc');
    }

    if (!data.houseDescription || data.houseDescription.trim().length === 0) {
      errors.push('Mô tả nhà là bắt buộc');
    }

    if (!data.itemId || data.itemId.length === 0) {
      errors.push('Ít nhất một vật phẩm trang trí là bắt buộc');
    }

    if (data.itemId && data.itemId.length > 10) {
      errors.push('Không thể có quá 10 vật phẩm trang trí');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ===== ANALYTICS HELPERS =====
  async getHouseDecorStats(userId?: string): Promise<{
    totalDecorations: number;
    decorationsByItemType: Array<{ itemType: string; count: number }>;
    averageItemsPerDecoration: number;
    recentDecorations: HouseDecoration[];
  } | null> {
    try {
      const params = userId ? { userId } : {};
      const response = await this.getAllHouseDecorations(params);

      if (response.success && response.data) {
        const decorations = response.data.houseDecorations;
        const totalDecorations = response.data.pagination.totalDecorations;

        // Group by item type
        const itemTypeMap = new Map<string, number>();
        decorations.forEach(decoration => {
          if (decoration.itemId) {
            decoration.itemId.forEach(item => {
              const itemType = item.itemType;
              itemTypeMap.set(itemType, (itemTypeMap.get(itemType) || 0) + 1);
            });
          }
        });

        const decorationsByItemType = Array.from(itemTypeMap.entries()).map(([itemType, count]) => ({
          itemType,
          count
        }));

        // Calculate average items per decoration
        const totalItems = decorations.reduce((sum, decoration) => 
          sum + (decoration.itemId?.length || 0), 0
        );
        const averageItemsPerDecoration = totalDecorations > 0 ? totalItems / totalDecorations : 0;

        // Get recent decorations (last 5)
        const recentDecorations = decorations
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        return {
          totalDecorations,
          decorationsByItemType,
          averageItemsPerDecoration,
          recentDecorations: recentDecorations as unknown as HouseDecoration[]
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  // ===== BUSINESS LOGIC HELPERS =====
  async canUserDecorateHouse(userId: string, decorationId: string): Promise<boolean> {
    try {
      const response = await this.getUserHouseDecorations(userId);
      if (response.success && response.data) {
        return response.data.houseDecorations.some(decoration => decoration._id === decorationId);
      }
      return false;
    } catch {
      return false;
    }
  }

  async getDecorationsByItem(itemId: string): Promise<HouseDecorationWithItems[]> {
    try {
      const response = await this.getAllHouseDecorations();
      if (response.success && response.data) {
        return response.data.houseDecorations.filter(decoration =>
          decoration.itemId.some(item => item._id === itemId)
        );
      }
      return [];
    } catch {
      return [];
    }
  }

  async getPopularDecorations(limit: number = 10): Promise<HouseDecorationWithItems[]> {
    try {
      const response = await this.getAllHouseDecorations({ limit });
      return response.data?.houseDecorations || [];
    } catch {
      return [];
    }
  }

  // ===== DESIGN HELPERS =====
  async getDecorationThemes(): Promise<string[]> {
    try {
      const response = await this.getAllHouseDecorations();
      if (response.success && response.data) {
        const themes = new Set<string>();
        response.data.houseDecorations.forEach(decoration => {
          // Extract theme from house name or description
          const words = decoration.houseName.toLowerCase().split(' ');
          words.forEach(word => {
            if (word.length > 3) {
              themes.add(word);
            }
          });
        });
        return Array.from(themes);
      }
      return [];
    } catch {
      return [];
    }
  }

  async getDecorationsByTheme(theme: string): Promise<HouseDecorationWithItems[]> {
    try {
      const response = await this.getAllHouseDecorations();
      if (response.success && response.data) {
        return response.data.houseDecorations.filter(decoration =>
          decoration.houseName.toLowerCase().includes(theme.toLowerCase()) ||
          decoration.houseDescription.toLowerCase().includes(theme.toLowerCase())
        );
      }
      return [];
    } catch {
      return [];
    }
  }
}

// Create singleton instance
const houseDecorService = new HouseDecorService();

export default houseDecorService;
