import type { BaseEntity } from './base';

// ===== RANKING TYPES =====
export interface Ranking extends BaseEntity {
  userId: string;
  totalPoints: number;
  rank: number;
  season: string;
}

// ===== RANKING WITH POPULATED DATA =====
export interface RankingWithUser extends Omit<Ranking, 'userId'> {
  userId: RankingUserReference;
}

// ===== RANKING USER REFERENCE =====
export interface RankingUserReference {
  _id: string;
  userName: string;
  avatar?: string;
  points: number;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    totalScore: number;
    averageScore: number;
  };
}

// ===== RANKING REQUEST TYPES =====
export interface CreateRankingRequest {
  userId: string;
  totalPoints: number;
  rank: number;
  season: string;
}

export interface UpdateRankingRequest {
  totalPoints?: number;
  rank?: number;
  season?: string;
}

export interface UpdateRankingsRequest {
  season: string;
  rankings: Array<{
    userId: string;
    totalPoints: number;
    rank: number;
  }>;
}

// ===== RANKING RESPONSE TYPES =====
export interface RankingListResponse {
  rankings: RankingWithUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRankings: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface RankingStatsResponse {
  totalRankings: number;
  rankingsBySeason: Array<{
    season: string;
    count: number;
  }>;
  averagePoints: number;
  topRankings: RankingWithUser[];
}

// ===== RANKING QUERY PARAMS =====
export interface RankingQueryParams {
  page?: number;
  limit?: number;
  season?: string;
  userId?: string;
  minRank?: number;
  maxRank?: number;
  minPoints?: number;
  maxPoints?: number;
}

// ===== RANKING FORM TYPES =====
export interface RankingForm {
  userId: string;
  totalPoints: number;
  rank: number;
  season: string;
}

export interface RankingSearchForm {
  season?: string;
  userId?: string;
  minRank?: number;
  maxRank?: number;
  minPoints?: number;
  maxPoints?: number;
}

// ===== RANKING VALIDATION =====
export interface RankingValidation {
  isValid: boolean;
  errors: string[];
}

// ===== RANKING STATS =====
export interface RankingStats {
  totalRankings: number;
  rankingsBySeason: Array<{
    season: string;
    count: number;
  }>;
  averagePoints: number;
  topRankings: RankingWithUser[];
}

// ===== RANKING ANALYTICS =====
export interface RankingAnalytics {
  season: string;
  totalPlayers: number;
  averagePoints: number;
  highestPoints: number;
  lowestPoints: number;
  rankDistribution: Array<{
    rankRange: string;
    count: number;
  }>;
}

export interface RankingAnalyticsResponse {
  analytics: RankingAnalytics[];
  summary: {
    totalSeasons: number;
    totalPlayers: number;
    averagePoints: number;
    mostCompetitiveSeason: string;
  };
}

// ===== RANKING FILTERS =====
export interface RankingFilters {
  season?: string;
  userId?: string;
  minRank?: number;
  maxRank?: number;
  minPoints?: number;
  maxPoints?: number;
  page?: number;
  limit?: number;
}

// ===== LEADERBOARD TYPES =====
export interface Leaderboard {
  season: string;
  rankings: RankingWithUser[];
  totalPlayers: number;
  lastUpdated: string;
}

export interface LeaderboardResponse {
  leaderboard: Leaderboard;
  userRank?: RankingWithUser;
  nearbyRankings: RankingWithUser[];
}

// ===== SEASON TYPES =====
export interface Season {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description?: string;
}

export interface SeasonResponse {
  seasons: Season[];
  currentSeason?: Season;
  upcomingSeason?: Season;
}

// ===== RANKING PROGRESS =====
export interface RankingProgress {
  userId: string;
  currentRank: number;
  previousRank: number;
  rankChange: number;
  currentPoints: number;
  previousPoints: number;
  pointsChange: number;
  season: string;
}

export interface RankingProgressResponse {
  progress: RankingProgress[];
  summary: {
    totalUsers: number;
    usersImproved: number;
    usersDeclined: number;
    averageRankChange: number;
  };
}

// ===== RANKING COMPARISON =====
export interface RankingComparison {
  userId: string;
  currentSeason: RankingWithUser;
  previousSeason?: RankingWithUser;
  improvement: {
    rankChange: number;
    pointsChange: number;
    percentageChange: number;
  };
}

export interface RankingComparisonResponse {
  comparisons: RankingComparison[];
  summary: {
    totalComparisons: number;
    averageImprovement: number;
    mostImproved: RankingComparison;
    mostDeclined: RankingComparison;
  };
}