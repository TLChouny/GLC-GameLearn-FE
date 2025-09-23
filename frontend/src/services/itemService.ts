import apiService from './api';
import type {
  Item,
  CreateItemRequest,
  UpdateItemRequest,
  ItemListResponse,
  ItemStatsResponse,
  ItemQueryParams,
  HouseDecoration,
  HouseDecorationWithItems,
  CreateHouseDecorationRequest,
  UpdateHouseDecorationRequest,
  HouseDecorationListResponse,
  HouseDecorationQueryParams,
  Trade,
  TradeWithDetails,
  CreateTradeRequest,
  UpdateTradeRequest,
  TradeHistoryResponse,
  TradeQueryParams,
  ApiResponse
} from '../types';

const BASE_URL = '/items';

export const itemService = {
  // ===== ITEM CRUD =====
  createItem: async (data: CreateItemRequest): Promise<ApiResponse<Item>> => {
    return apiService.post(`${BASE_URL}/items`, data);
  },

  getAllItems: async (params?: ItemQueryParams): Promise<ApiResponse<ItemListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`${BASE_URL}/items?${queryParams.toString()}`);
  },

  getItemById: async (id: string): Promise<ApiResponse<Item>> => {
    return apiService.get(`${BASE_URL}/items/${id}`);
  },

  updateItem: async (id: string, data: UpdateItemRequest): Promise<ApiResponse<Item>> => {
    return apiService.put(`${BASE_URL}/items/${id}`, data);
  },

  deleteItem: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete(`${BASE_URL}/items/${id}`);
  },

  // ===== ITEM STATS =====
  getItemStats: async (): Promise<ApiResponse<ItemStatsResponse>> => {
    return apiService.get(`${BASE_URL}/items/stats`);
  },

  getItemsByType: async (itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special', page: number = 1, limit: number = 10): Promise<ApiResponse<ItemListResponse>> => {
    return apiService.get(`${BASE_URL}/items/type/${itemType}?page=${page}&limit=${limit}`);
  },

  getItemsByPriceRange: async (minPrice: number, maxPrice: number, page: number = 1, limit: number = 10): Promise<ApiResponse<ItemListResponse>> => {
    return apiService.get(`${BASE_URL}/items/price?min=${minPrice}&max=${maxPrice}&page=${page}&limit=${limit}`);
  },

  searchItems: async (query: string, page: number = 1, limit: number = 10): Promise<ApiResponse<ItemListResponse>> => {
    return apiService.get(`${BASE_URL}/items/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  // ===== HOUSE DECORATION CRUD =====
  createHouseDecoration: async (data: CreateHouseDecorationRequest): Promise<ApiResponse<HouseDecoration>> => {
    return apiService.post(`${BASE_URL}/house-decorations`, data);
  },

  getAllHouseDecorations: async (params?: HouseDecorationQueryParams): Promise<ApiResponse<HouseDecorationListResponse>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`${BASE_URL}/house-decorations?${queryParams.toString()}`);
  },

  getHouseDecorationById: async (id: string): Promise<ApiResponse<HouseDecorationWithItems>> => {
    return apiService.get(`${BASE_URL}/house-decorations/${id}`);
  },

  updateHouseDecoration: async (id: string, data: UpdateHouseDecorationRequest): Promise<ApiResponse<HouseDecoration>> => {
    return apiService.put(`${BASE_URL}/house-decorations/${id}`, data);
  },

  deleteHouseDecoration: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete(`${BASE_URL}/house-decorations/${id}`);
  },

  // ===== HOUSE DECORATION UTILITIES =====
  getUserHouseDecorations: async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<HouseDecorationListResponse>> => {
    return apiService.get(`${BASE_URL}/house-decorations/user/${userId}?page=${page}&limit=${limit}`);
  },

  getHouseDecorationsByItemType: async (itemType: string, page: number = 1, limit: number = 10): Promise<ApiResponse<HouseDecorationListResponse>> => {
    return apiService.get(`${BASE_URL}/house-decorations/type/${itemType}?page=${page}&limit=${limit}`);
  },

  searchHouseDecorations: async (query: string, page: number = 1, limit: number = 10): Promise<ApiResponse<HouseDecorationListResponse>> => {
    return apiService.get(`${BASE_URL}/house-decorations/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  // ===== TRADE CRUD =====
  createTrade: async (data: CreateTradeRequest): Promise<ApiResponse<Trade>> => {
    return apiService.post(`${BASE_URL}/trades`, data);
  },

  getAllTrades: async (params?: TradeQueryParams): Promise<ApiResponse<TradeHistoryResponse>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`${BASE_URL}/trades?${queryParams.toString()}`);
  },

  getTradeById: async (id: string): Promise<ApiResponse<TradeWithDetails>> => {
    return apiService.get(`${BASE_URL}/trades/${id}`);
  },

  updateTrade: async (id: string, data: UpdateTradeRequest): Promise<ApiResponse<Trade>> => {
    return apiService.put(`${BASE_URL}/trades/${id}`, data);
  },

  deleteTrade: async (id: string): Promise<ApiResponse<null>> => {
    return apiService.delete(`${BASE_URL}/trades/${id}`);
  },

  // ===== TRADE HISTORY =====
  getTradeHistory: async (matchId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<TradeHistoryResponse>> => {
    return apiService.get(`${BASE_URL}/trades/match/${matchId}?page=${page}&limit=${limit}`);
  },

  getUserTradeHistory: async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<TradeHistoryResponse>> => {
    return apiService.get(`${BASE_URL}/trades/user/${userId}?page=${page}&limit=${limit}`);
  },

  getTradesByItem: async (itemId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<TradeHistoryResponse>> => {
    return apiService.get(`${BASE_URL}/trades/item/${itemId}?page=${page}&limit=${limit}`);
  },

  // ===== SHOPPING CART =====
  addToCart: async (itemId: string, quantity: number = 1): Promise<ApiResponse<{ message: string }>> => {
    return apiService.post(`${BASE_URL}/cart/add`, { itemId, quantity });
  },

  removeFromCart: async (itemId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiService.delete(`${BASE_URL}/cart/remove/${itemId}`);
  },

  updateCartItemQuantity: async (itemId: string, quantity: number): Promise<ApiResponse<{ message: string }>> => {
    return apiService.put(`${BASE_URL}/cart/update`, { itemId, quantity });
  },

  getCart: async (): Promise<ApiResponse<{
    items: Array<{
      item: Item;
      quantity: number;
    }>;
    totalPrice: number;
    totalItems: number;
  }>> => {
    return apiService.get(`${BASE_URL}/cart`);
  },

  clearCart: async (): Promise<ApiResponse<{ message: string }>> => {
    return apiService.delete(`${BASE_URL}/cart/clear`);
  },

  // ===== PURCHASE =====
  purchaseItems: async (itemIds: string[]): Promise<ApiResponse<{
    success: boolean;
    message: string;
    purchasedItems: Item[];
    totalCost: number;
  }>> => {
    return apiService.post(`${BASE_URL}/purchase`, { itemIds });
  },

  purchaseFromCart: async (): Promise<ApiResponse<{
    success: boolean;
    message: string;
    purchasedItems: Item[];
    totalCost: number;
  }>> => {
    return apiService.post(`${BASE_URL}/cart/purchase`);
  },

  // ===== USER INVENTORY =====
  getUserInventory: async (userId: string): Promise<ApiResponse<{
    items: Item[];
    houseDecorations: HouseDecorationWithItems[];
    totalValue: number;
    totalItems: number;
  }>> => {
    return apiService.get(`${BASE_URL}/inventory/${userId}`);
  },

  getUserItems: async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<ItemListResponse>> => {
    return apiService.get(`${BASE_URL}/inventory/${userId}/items?page=${page}&limit=${limit}`);
  },

  getUserInventoryHouseDecorations: async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<HouseDecorationListResponse>> => {
    return apiService.get(`${BASE_URL}/inventory/${userId}/house-decorations?page=${page}&limit=${limit}`);
  },

  // ===== UTILITY METHODS =====
  getItemTypeColor: (itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special'): string => {
    switch (itemType) {
      case 'weapon': return '#F44336';
      case 'armor': return '#2196F3';
      case 'consumable': return '#4CAF50';
      case 'decoration': return '#FF9800';
      case 'special': return '#9C27B0';
      default: return '#9E9E9E';
    }
  },

  getItemTypeLabel: (itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special'): string => {
    switch (itemType) {
      case 'weapon': return 'Vũ khí';
      case 'armor': return 'Giáp';
      case 'consumable': return 'Tiêu hao';
      case 'decoration': return 'Trang trí';
      case 'special': return 'Đặc biệt';
      default: return 'Không xác định';
    }
  },

  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  },

  calculateTotalValue: (items: Item[]): number => {
    return items.reduce((total, item) => total + item.itemPrice, 0);
  },

  // ===== VALIDATION HELPERS =====
  validateItemData: (data: CreateItemRequest | UpdateItemRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if ('itemName' in data && data.itemName) {
      if (data.itemName.length < 3) {
        errors.push('Tên vật phẩm phải có ít nhất 3 ký tự');
      }
      if (data.itemName.length > 100) {
        errors.push('Tên vật phẩm không được quá 100 ký tự');
      }
    }

    if ('itemType' in data && data.itemType) {
      if (!['weapon', 'armor', 'consumable', 'decoration', 'special'].includes(data.itemType)) {
        errors.push('Loại vật phẩm không hợp lệ');
      }
    }

    if ('itemPrice' in data && data.itemPrice !== undefined) {
      if (data.itemPrice < 0) {
        errors.push('Giá vật phẩm không được âm');
      }
    }

    if ('itemImage' in data && data.itemImage) {
      if (!data.itemImage.startsWith('http') && !data.itemImage.startsWith('/')) {
        errors.push('URL hình ảnh không hợp lệ');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateHouseDecorationData: (data: CreateHouseDecorationRequest | UpdateHouseDecorationRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if ('houseName' in data && data.houseName) {
      if (data.houseName.length < 3) {
        errors.push('Tên nhà phải có ít nhất 3 ký tự');
      }
      if (data.houseName.length > 100) {
        errors.push('Tên nhà không được quá 100 ký tự');
      }
    }

    if ('houseDescription' in data && data.houseDescription) {
      if (data.houseDescription.length > 500) {
        errors.push('Mô tả nhà không được quá 500 ký tự');
      }
    }

    if ('itemId' in data && data.itemId) {
      if (!Array.isArray(data.itemId)) {
        errors.push('Danh sách vật phẩm phải là mảng');
      }
      if (data.itemId.length === 0) {
        errors.push('Phải có ít nhất 1 vật phẩm');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  validateTradeData: (data: CreateTradeRequest): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.matchId) {
      errors.push('Phải chọn trận đấu');
    }

    if (!data.itemTaken) {
      errors.push('Phải chọn vật phẩm');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
