import type { BaseEntity } from './base';

// ===== ITEM TYPES =====
export interface Item extends BaseEntity {
  itemName: string;
  itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  itemPrice: number;
  itemImage: string;
}

// ===== ITEM REQUEST TYPES =====
export interface CreateItemRequest {
  itemName: string;
  itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  itemPrice: number;
  itemImage: string;
}

export interface UpdateItemRequest {
  itemName?: string;
  itemType?: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  itemPrice?: number;
  itemImage?: string;
}

// ===== ITEM RESPONSE TYPES =====
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

export interface ItemStatsResponse {
  totalItems: number;
  itemsByType: Array<{
    itemType: string;
    count: number;
  }>;
  averagePrice: number;
  mostExpensiveItem: Item;
  cheapestItem: Item;
}

// ===== ITEM QUERY PARAMS =====
export interface ItemQueryParams {
  page?: number;
  limit?: number;
  itemType?: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ===== ITEM FORM TYPES =====
export interface ItemForm {
  itemName: string;
  itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  itemPrice: number;
  itemImage: string;
}

export interface ItemSearchForm {
  search: string;
  itemType?: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  minPrice?: number;
  maxPrice?: number;
}

// ===== ITEM VALIDATION =====
export interface ItemValidation {
  isValid: boolean;
  errors: string[];
}

// ===== ITEM STATS =====
export interface ItemStats {
  totalItems: number;
  itemsByType: Record<'weapon' | 'armor' | 'consumable' | 'decoration' | 'special', number>;
  averagePrice: number;
  mostExpensiveItem: Item;
  cheapestItem: Item;
}

// ===== ITEM FILTERS =====
export interface ItemFilters {
  itemType?: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  search?: string;
}

// ===== SHOPPING CART TYPES =====
export interface CartItem {
  item: Item;
  quantity: number;
}

export interface ShoppingCart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

// ===== INVENTORY TYPES =====
export interface UserInventory {
  items: Item[];
  houseDecorations: HouseDecorationWithItems[];
  totalValue: number;
}

// ===== HOUSE DECORATION TYPES =====
export interface HouseDecoration extends BaseEntity {
  houseName: string;
  houseDescription: string;
  itemId: string[];
}

export interface HouseDecorationWithItems extends Omit<HouseDecoration, 'itemId'> {
  itemId: Item[];
}

// ===== HOUSE DECORATION REQUEST TYPES =====
export interface CreateHouseDecorationRequest {
  houseName: string;
  houseDescription: string;
  itemId: string[];
}

export interface UpdateHouseDecorationRequest {
  houseName?: string;
  houseDescription?: string;
  itemId?: string[];
}

// ===== HOUSE DECORATION RESPONSE TYPES =====
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

// ===== HOUSE DECORATION QUERY PARAMS =====
export interface HouseDecorationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  itemType?: string;
}

// ===== TRADE TYPES =====
// Trade types đã được định nghĩa trong trade.ts riêng biệt