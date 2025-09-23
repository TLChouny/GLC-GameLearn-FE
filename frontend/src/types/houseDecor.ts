import type { BaseEntity } from './base';

// ===== HOUSE DECORATION TYPES =====
export interface HouseDecor extends BaseEntity {
  houseName: string;
  houseDescription: string;
  itemId: string[];
}

// ===== HOUSE DECORATION WITH POPULATED DATA =====
export interface HouseDecorWithItems extends Omit<HouseDecor, 'itemId'> {
  itemId: HouseDecorItemReference[];
}

// ===== HOUSE DECOR ITEM REFERENCE =====
export interface HouseDecorItemReference {
  _id: string;
  itemName: string;
  itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  itemPrice: number;
  itemImage: string;
}

// ===== HOUSE DECORATION REQUEST TYPES =====
export interface CreateHouseDecorRequest {
  houseName: string;
  houseDescription: string;
  itemId: string[];
}

export interface UpdateHouseDecorRequest {
  houseName?: string;
  houseDescription?: string;
  itemId?: string[];
}

// ===== HOUSE DECORATION RESPONSE TYPES =====
export interface HouseDecorListResponse {
  houseDecorations: HouseDecorWithItems[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDecorations: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface HouseDecorStatsResponse {
  totalDecorations: number;
  decorationsByItemType: Array<{
    itemType: string;
    count: number;
  }>;
  averageItemsPerDecoration: number;
  recentDecorations: HouseDecor[];
}

// ===== HOUSE DECORATION QUERY PARAMS =====
export interface HouseDecorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  itemType?: string;
  userId?: string;
}

// ===== HOUSE DECORATION FILTERS =====
export interface HouseDecorationFilters {
  search?: string;
  itemType?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// ===== HOUSE DECORATION FORM TYPES =====
export interface HouseDecorForm {
  houseName: string;
  houseDescription: string;
  itemId: string[];
}

export interface HouseDecorSearchForm {
  search: string;
  itemType?: string;
}

// ===== HOUSE DECORATION VALIDATION =====
export interface HouseDecorValidation {
  isValid: boolean;
  errors: string[];
}

// ===== HOUSE DECORATION STATS =====
export interface HouseDecorStats {
  totalDecorations: number;
  decorationsByItemType: Array<{
    itemType: string;
    count: number;
  }>;
  averageItemsPerDecoration: number;
  recentDecorations: HouseDecor[];
}

// ===== HOUSE DECORATION ANALYTICS =====
export interface HouseDecorAnalytics {
  decorationId: string;
  itemCount: number;
  totalValue: number;
  itemTypes: string[];
  popularityScore: number;
  creationDate: string;
}

export interface HouseDecorAnalyticsResponse {
  analytics: HouseDecorAnalytics[];
  summary: {
    totalDecorations: number;
    totalValue: number;
    averageValue: number;
    mostPopularItemType: string;
  };
}

// ===== HOUSE DECORATION FILTERS =====
export interface HouseDecorFilters {
  page?: number;
  limit?: number;
  search?: string;
  itemType?: string;
  userId?: string;
  minValue?: number;
  maxValue?: number;
}

// ===== HOUSE DECORATION THEMES =====
export interface HouseDecorTheme {
  name: string;
  description: string;
  itemTypes: string[];
  colorScheme: string[];
  style: 'modern' | 'classic' | 'rustic' | 'minimalist' | 'eclectic';
}

export interface HouseDecorThemeResponse {
  themes: HouseDecorTheme[];
  popularThemes: HouseDecorTheme[];
}

// ===== HOUSE DECORATION COLLECTIONS =====
export interface HouseDecorCollection {
  name: string;
  description: string;
  decorations: HouseDecorWithItems[];
  totalValue: number;
  itemCount: number;
  theme: string;
}

export interface HouseDecorCollectionResponse {
  collections: HouseDecorCollection[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCollections: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== HOUSE DECORATION RECOMMENDATIONS =====
export interface HouseDecorRecommendation {
  decorationId: string;
  reason: string;
  score: number;
  suggestedItems: HouseDecorItemReference[];
  compatibilityScore: number;
}

export interface HouseDecorRecommendationResponse {
  recommendations: HouseDecorRecommendation[];
  basedOn: 'similar_users' | 'item_compatibility' | 'popular_trends' | 'user_preferences';
}

// ===== HOUSE DECORATION SHARING =====
export interface HouseDecorShare {
  decorationId: string;
  userId: string;
  shareType: 'public' | 'friends' | 'private';
  shareDate: string;
  viewCount: number;
  likeCount: number;
}

export interface HouseDecorShareResponse {
  shares: HouseDecorShare[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalShares: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
