import type { BaseEntity } from './base';

// ===== LUCKY WHEEL TYPES =====
export interface LuckyWheel extends BaseEntity {
  wheelTitle: string;
  wheelDescription: string;
  maxSpinPerDay: number;
}

export interface LuckyWheelWithPrizes extends LuckyWheel {
  prizes?: LuckyWheelPrize[];
}

export interface CreateLuckyWheelRequest {
  wheelTitle: string;
  wheelDescription: string;
  maxSpinPerDay?: number;
}

export interface UpdateLuckyWheelRequest {
  wheelTitle?: string;
  wheelDescription?: string;
  maxSpinPerDay?: number;
}

// ===== LUCKY WHEEL PRIZE TYPES =====
export type PrizeType = 'item' | 'points' | 'coins' | 'special';

export interface LuckyWheelPrize extends BaseEntity {
  wheelId: string;
  itemId?: string;
  prizeName: string;
  prizeType: PrizeType;
  prizeValue: number;
  probability: number;
}

export interface LuckyWheelPrizeWithItem extends LuckyWheelPrize {
  item?: {
    _id: string;
    itemName: string;
    itemType: string;
    itemPrice: number;
    itemImage: string;
  };
}

export interface CreateLuckyWheelPrizeRequest {
  wheelId: string;
  itemId?: string;
  prizeName: string;
  prizeType: PrizeType;
  prizeValue: number;
  probability: number;
}

export interface UpdateLuckyWheelPrizeRequest {
  wheelId?: string;
  itemId?: string;
  prizeName?: string;
  prizeType?: PrizeType;
  prizeValue?: number;
  probability?: number;
}

// ===== LUCKY WHEEL SPIN TYPES =====
export interface LuckyWheelSpin extends BaseEntity {
  wheelId: string;
  userId: string;
  prizeId?: string;
  spinResult: string;
}

export interface LuckyWheelSpinWithDetails extends LuckyWheelSpin {
  wheel?: LuckyWheel;
  user?: {
    _id: string;
    userName: string;
    avatar?: string;
  };
  prize?: LuckyWheelPrize;
}

export interface SpinResult {
  spinResult: string;
  prize: {
    name: string;
    type: PrizeType;
    value: number;
    itemId?: string;
  };
  remainingSpins: number;
}

export interface WheelInfo {
  wheel: LuckyWheel;
  prizes: LuckyWheelPrizeWithItem[];
  remainingSpins: number;
  canSpin: boolean;
}

export interface SpinStats {
  totalSpins: number;
  todaySpins: number;
  prizeStats: Array<{
    _id: string;
    count: number;
  }>;
  wheelStats: Array<{
    _id: string;
    wheelTitle: string;
    count: number;
  }>;
}

// ===== LUCKY WHEEL API RESPONSES =====
export interface LuckyWheelListResponse {
  luckyWheels: LuckyWheel[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalWheels: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LuckyWheelPrizeListResponse {
  prizes: LuckyWheelPrizeWithItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPrizes: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LuckyWheelSpinHistoryResponse {
  spinHistory: LuckyWheelSpinWithDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSpins: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== LUCKY WHEEL QUERY PARAMS =====
export interface LuckyWheelQueryParams {
  page?: number;
  limit?: number;
}

export interface LuckyWheelPrizeQueryParams extends LuckyWheelQueryParams {
  wheelId: string;
}

export interface LuckyWheelSpinQueryParams extends LuckyWheelQueryParams {
  wheelId?: string;
}
