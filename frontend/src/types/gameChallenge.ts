import type { BaseEntity } from './base';

// ===== GAME CHALLENGE TYPES =====
export interface GameChallenge extends BaseEntity {
  title: string;
  subjectId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardPoints: number;
}

// ===== GAME CHALLENGE WITH POPULATED DATA =====
export interface GameChallengeWithSubject extends Omit<GameChallenge, 'subjectId'> {
  subjectId: GameChallengeSubjectReference;
}

// ===== GAME CHALLENGE SUBJECT REFERENCE =====
export interface GameChallengeSubjectReference {
  _id: string;
  subjectName: string;
  subjectDescription: string;
  subjectUnit: string;
}

// ===== GAME CHALLENGE REQUEST TYPES =====
export interface CreateGameChallengeRequest {
  title: string;
  subjectId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardPoints: number;
}

export interface UpdateGameChallengeRequest {
  title?: string;
  subjectId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  rewardPoints?: number;
}

// ===== GAME CHALLENGE RESPONSE TYPES =====
export interface GameChallengeListResponse {
  gameChallenges: GameChallengeWithSubject[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalChallenges: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GameChallengeStatsResponse {
  totalChallenges: number;
  challengesByDifficulty: Array<{
    difficulty: string;
    count: number;
  }>;
  challengesBySubject: Array<{
    subjectName: string;
    count: number;
  }>;
  averageRewardPoints: number;
  recentChallenges: GameChallenge[];
}

// ===== GAME CHALLENGE QUERY PARAMS =====
export interface GameChallengeQueryParams {
  page?: number;
  limit?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  subjectId?: string;
  search?: string;
  minRewardPoints?: number;
  maxRewardPoints?: number;
}

// ===== GAME CHALLENGE FORM TYPES =====
export interface GameChallengeForm {
  title: string;
  subjectId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardPoints: number;
}

export interface GameChallengeSearchForm {
  search: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  subjectId?: string;
  minRewardPoints?: number;
  maxRewardPoints?: number;
}

// ===== GAME CHALLENGE VALIDATION =====
export interface GameChallengeValidation {
  isValid: boolean;
  errors: string[];
}

// ===== GAME CHALLENGE STATS =====
export interface GameChallengeStats {
  totalChallenges: number;
  challengesByDifficulty: Array<{
    difficulty: string;
    count: number;
  }>;
  challengesBySubject: Array<{
    subjectName: string;
    count: number;
  }>;
  averageRewardPoints: number;
  mostPopularChallenges: GameChallenge[];
  recentChallenges: GameChallenge[];
}

// ===== GAME CHALLENGE ANALYTICS =====
export interface GameChallengeAnalytics {
  challengeId: string;
  totalMatches: number;
  totalPlayers: number;
  averageCompletionTime: number;
  successRate: number;
  popularityScore: number;
}

export interface GameChallengeAnalyticsResponse {
  analytics: GameChallengeAnalytics[];
  summary: {
    totalChallenges: number;
    totalMatches: number;
    totalPlayers: number;
    averageSuccessRate: number;
    averagePopularityScore: number;
  };
}

// ===== GAME CHALLENGE FILTERS =====
export interface GameChallengeFilters {
  difficulty?: 'easy' | 'medium' | 'hard';
  subjectId?: string;
  page?: number;
  limit?: number;
  search?: string;
  minRewardPoints?: number;
  maxRewardPoints?: number;
}
