import type { BaseEntity } from './base';

// ===== TRADE TYPES =====
export interface Trade extends BaseEntity {
  matchId: string;
  itemTaken: string;
  bookingId?: string;
  arvRegimenId?: string;
}

// ===== TRADE WITH POPULATED DATA =====
export interface TradeWithDetails extends Omit<Trade, 'itemTaken' | 'matchId'> {
  itemTaken: TradeItemReference;
  matchId: TradeMatchReference;
}

// ===== TRADE ITEM REFERENCE =====
export interface TradeItemReference {
  _id: string;
  itemName: string;
  itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  itemPrice: number;
  itemImage: string;
}

// ===== TRADE MATCH REFERENCE =====
export interface TradeMatchReference {
  _id: string;
  status: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
  players: Array<{
    _id: string;
    userName: string;
    avatar?: string;
  }>;
  gameChallengeId: {
    _id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    rewardPoints: number;
  };
}

// ===== TRADE REQUEST TYPES =====
export interface CreateTradeRequest {
  matchId: string;
  itemTaken: string;
  bookingId?: string;
  arvRegimenId?: string;
}

// ===== TRADE QUERY PARAMS =====
export interface TradeQueryParams {
  page?: number;
  limit?: number;
  matchId?: string;
  itemId?: string;
  userId?: string;
  search?: string;
  query?: string;
}

export interface UpdateTradeRequest {
  matchId?: string;
  itemTaken?: string;
  bookingId?: string;
  arvRegimenId?: string;
}

// ===== TRADE RESPONSE TYPES =====
export interface TradeListResponse {
  trades: TradeWithDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTrades: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TradeStatsResponse {
  totalTrades: number;
  tradesByItemType: Array<{
    itemType: string;
    count: number;
  }>;
  tradesByMatch: Array<{
    matchTitle: string;
    count: number;
  }>;
  averageItemValue: number;
  recentTrades: Trade[];
}

// ===== TRADE QUERY PARAMS =====
export interface TradeQueryParams {
  page?: number;
  limit?: number;
  matchId?: string;
  itemId?: string;
  userId?: string;
  itemType?: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
}

// ===== TRADE FORM TYPES =====
export interface TradeForm {
  matchId: string;
  itemTaken: string;
  bookingId?: string;
  arvRegimenId?: string;
}

export interface TradeSearchForm {
  matchId?: string;
  itemType?: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  userId?: string;
}

// ===== TRADE VALIDATION =====
export interface TradeValidation {
  isValid: boolean;
  errors: string[];
}

// ===== TRADE STATS =====
export interface TradeStats {
  totalTrades: number;
  tradesByItemType: Array<{
    itemType: string;
    count: number;
  }>;
  tradesByMatch: Array<{
    matchTitle: string;
    count: number;
  }>;
  averageItemValue: number;
  recentTrades: Trade[];
}

// ===== TRADE ANALYTICS =====
export interface TradeAnalytics {
  tradeId: string;
  itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  itemValue: number;
  matchDifficulty: 'easy' | 'medium' | 'hard';
  tradeDate: string;
  completionTime: number;
}

export interface TradeAnalyticsResponse {
  analytics: TradeAnalytics[];
  summary: {
    totalTrades: number;
    totalValue: number;
    averageValue: number;
    tradesByType: Record<string, number>;
  };
}

// ===== TRADE FILTERS =====
export interface TradeFilters {
  matchId?: string;
  itemId?: string;
  userId?: string;
  itemType?: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

// ===== TRADE HISTORY =====
export interface TradeHistory {
  userId: string;
  trades: TradeWithDetails[];
  totalValue: number;
  totalItems: number;
  mostTradedItem: TradeItemReference;
  averageTradeValue: number;
}

export interface TradeHistoryResponse {
  history: TradeHistory;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTrades: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== TRADE SUMMARY =====
export interface TradeSummary {
  totalTrades: number;
  totalValue: number;
  averageValue: number;
  tradesByType: Record<'weapon' | 'armor' | 'consumable' | 'decoration' | 'special', number>;
  tradesByDifficulty: Record<'easy' | 'medium' | 'hard', number>;
  recentActivity: TradeWithDetails[];
}

// ===== TRADE LIST RESPONSE =====
export interface TradeListResponse {
  trades: TradeWithDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTrades: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== TRADE HISTORY RESPONSE =====
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

// ===== TRADE FILTERS =====
export interface TradeFilters {
  matchId?: string;
  itemId?: string;
  userId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ===== UPDATE TRADE REQUEST =====
export interface UpdateTradeRequest {
  matchId?: string;
  itemTaken?: string;
  bookingId?: string;
  arvRegimenId?: string;
}
