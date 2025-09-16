import type { BaseEntity, ItemType } from './base';

// Item Entity
export interface Item extends BaseEntity {
  itemName: string;
  itemType: ItemType;
  itemPrice: number;
  itemImage: string;
}

// House Decoration Entity
export interface HouseDecoration extends BaseEntity {
  houseName: string;
  houseDescription: string;
  itemId: string[];
}

// House Decoration with populated items
export interface HouseDecorationWithItems extends Omit<HouseDecoration, 'itemId'> {
  itemId: Item[];
}

// Trade Entity
export interface Trade extends BaseEntity {
  matchId: string;
  itemTaken: string;
  bookingId?: string;
  arvRegimenId?: string;
}

// Trade with populated data
export interface TradeWithDetails extends Omit<Trade, 'itemTaken' | 'matchId'> {
  itemTaken: Item;
  matchId: {
    _id: string;
    status: string;
    players: string[];
  };
}

// Request types
export interface CreateItemRequest {
  itemName: string;
  itemType: ItemType;
  itemPrice: number;
  itemImage: string;
}

export interface UpdateItemRequest {
  itemName?: string;
  itemType?: ItemType;
  itemPrice?: number;
  itemImage?: string;
}

export interface CreateHouseDecorationRequest {
  houseName: string;
  houseDescription: string;
  itemId: string[];
}

export interface CreateTradeRequest {
  matchId: string;
  itemTaken: string;
  bookingId?: string;
  arvRegimenId?: string;
}

// Response types
export interface ItemListResponse {
  items: Item[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface HouseDecorationListResponse {
  houseDecorations: HouseDecorationWithItems[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDecorations: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TradeHistoryResponse {
  trades: TradeWithDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTrades: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter types
export interface ItemFilters {
  itemType?: ItemType;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface HouseDecorationFilters {
  page?: number;
  limit?: number;
}

export interface TradeFilters {
  matchId?: string;
  page?: number;
  limit?: number;
}

// Shopping cart types
export interface CartItem {
  item: Item;
  quantity: number;
}

export interface ShoppingCart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

// Inventory types
export interface UserInventory {
  items: Item[];
  houseDecorations: HouseDecorationWithItems[];
  totalValue: number;
}

// Item statistics
export interface ItemStats {
  totalItems: number;
  itemsByType: Record<ItemType, number>;
  averagePrice: number;
  mostExpensiveItem: Item;
  cheapestItem: Item;
}
