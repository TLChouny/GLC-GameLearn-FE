import type { BaseEntity } from './base';

// ===== MATCH TYPES =====
export interface Match extends BaseEntity {
  players: string[];
  gameChallengeId: string;
  status: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
  winner?: string;
  loser?: string;
}

// ===== MATCH WITH POPULATED DATA =====
export interface MatchWithDetails extends Omit<Match, 'players' | 'gameChallengeId' | 'winner' | 'loser'> {
  players: MatchUserReference[];
  gameChallengeId: MatchGameChallengeReference;
  winner?: MatchUserReference;
  loser?: MatchUserReference;
}

// ===== MATCH USER REFERENCE =====
export interface MatchUserReference {
  _id: string;
  userName: string;
  avatar?: string;
  points: number;
  stats?: {
    gamesPlayed: number;
    gamesWon: number;
    totalScore: number;
    averageScore: number;
  };
}

// ===== MATCH GAME CHALLENGE REFERENCE =====
export interface MatchGameChallengeReference {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardPoints: number;
  subjectId: {
    _id: string;
    subjectName: string;
    subjectUnit: string;
  };
}

// ===== MATCH REQUEST TYPES =====
export interface CreateMatchRequest {
  players: string[];
  gameChallengeId: string;
}

export interface UpdateMatchStatusRequest {
  status: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
  winner?: string;
  loser?: string;
}

export interface JoinMatchRequest {
  matchId: string;
  userId: string;
}

export interface LeaveMatchRequest {
  matchId: string;
  userId: string;
}

// ===== MATCH RESPONSE TYPES =====
export interface MatchListResponse {
  matches: MatchWithDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMatches: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MatchStatsResponse {
  totalMatches: number;
  matchesByStatus: Array<{
    status: string;
    count: number;
  }>;
  matchesByDifficulty: Array<{
    difficulty: string;
    count: number;
  }>;
  averageMatchDuration: number;
  recentMatches: Match[];
}

// ===== MATCH QUERY PARAMS =====
export interface MatchQueryParams {
  page?: number;
  limit?: number;
  status?: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
  userId?: string;
  gameChallengeId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// ===== MATCH FORM TYPES =====
export interface MatchForm {
  players: string[];
  gameChallengeId: string;
}

export interface MatchSearchForm {
  status?: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
  gameChallengeId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// ===== MATCH VALIDATION =====
export interface MatchValidation {
  isValid: boolean;
  errors: string[];
}

// ===== MATCH STATS =====
export interface MatchStats {
  totalMatches: number;
  matchesByStatus: Array<{
    status: string;
    count: number;
  }>;
  matchesByDifficulty: Array<{
    difficulty: string;
    count: number;
  }>;
  averageMatchDuration: number;
  recentMatches: Match[];
}

// ===== MATCH ANALYTICS =====
export interface MatchAnalytics {
  matchId: string;
  duration: number;
  playerCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  successRate: number;
  averageScore: number;
}

export interface MatchAnalyticsResponse {
  analytics: MatchAnalytics[];
  summary: {
    totalMatches: number;
    totalDuration: number;
    averageDuration: number;
    averageSuccessRate: number;
    averageScore: number;
  };
}

// ===== MATCH FILTERS =====
export interface MatchFilters {
  status?: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
  userId?: string;
  page?: number;
  limit?: number;
  gameChallengeId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// ===== MATCH EVENTS =====
export interface MatchEvent {
  matchId: string;
  eventType: 'created' | 'joined' | 'started' | 'completed' | 'cancelled';
  userId?: string;
  timestamp: string;
  data?: Record<string, any>;
}

export interface MatchEventResponse {
  events: MatchEvent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
