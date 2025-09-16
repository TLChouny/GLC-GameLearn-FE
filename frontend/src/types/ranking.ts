import type { BaseEntity } from './base';

// Ranking Entity
export interface Ranking extends BaseEntity {
  userId: string;
  totalPoints: number;
  rank: number;
  season: string;
}

// Ranking with populated user data
export interface RankingWithUser extends Omit<Ranking, 'userId'> {
  userId: {
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
  };
}

// Season information
export interface Season {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  totalPlayers: number;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  user: {
    _id: string;
    userName: string;
    avatar?: string;
    points: number;
  };
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
  };
  season: string;
}

export interface Leaderboard {
  season: string;
  entries: LeaderboardEntry[];
  totalPlayers: number;
  lastUpdated: string;
}

// Ranking statistics
export interface RankingStats {
  totalSeasons: number;
  currentSeason: string;
  totalPlayers: number;
  averagePoints: number;
  topPlayer: RankingWithUser;
  seasonHistory: Season[];
}

// User ranking history
export interface UserRankingHistory {
  userId: string;
  userName: string;
  seasons: {
    season: string;
    rank: number;
    totalPoints: number;
    gamesPlayed: number;
    gamesWon: number;
  }[];
  bestRank: number;
  bestSeason: string;
  totalPointsAllTime: number;
}

// Request types
export interface UpdateRankingRequest {
  userId: string;
  totalPoints: number;
  season: string;
}

export interface UpdateAllRankingsRequest {
  season: string;
}

// Response types
export interface RankingListResponse {
  rankings: RankingWithUser[];
  season: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRankings: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TopRankingsResponse {
  rankings: RankingWithUser[];
  season: string;
  topCount: number;
}

export interface SeasonListResponse {
  seasons: string[];
}

export interface UserRankingResponse {
  ranking: RankingWithUser;
}

export interface LeaderboardResponse {
  leaderboard: Leaderboard;
}

export interface RankingStatsResponse {
  stats: RankingStats;
}

export interface UserRankingHistoryResponse {
  history: UserRankingHistory;
}

// Filter types
export interface RankingFilters {
  season?: string;
  page?: number;
  limit?: number;
}

export interface TopRankingsFilters {
  season: string;
  limit?: number;
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'ranking' | 'game' | 'social' | 'item';
  requirements: {
    type: string;
    value: number;
  }[];
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserAchievements {
  userId: string;
  achievements: Achievement[];
  totalPoints: number;
  unlockedCount: number;
  totalCount: number;
}

// Ranking comparison
export interface RankingComparison {
  user1: {
    userId: string;
    userName: string;
    rank: number;
    points: number;
  };
  user2: {
    userId: string;
    userName: string;
    rank: number;
    points: number;
  };
  season: string;
  difference: {
    rank: number;
    points: number;
  };
}
