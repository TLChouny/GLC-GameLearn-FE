import type { BaseEntity } from './base';

// ===== CERTIFICATE TYPES =====
export interface Certificate extends BaseEntity {
  certName: string;
  certDescription: string;
  gameChallengeId: string;
  matchId: string;
}

// ===== CERTIFICATE WITH POPULATED DATA =====
export interface CertificateWithDetails extends Omit<Certificate, 'gameChallengeId' | 'matchId'> {
  gameChallengeId: CertificateGameChallengeReference;
  matchId: CertificateMatchReference;
}

// ===== CERTIFICATE GAME CHALLENGE REFERENCE =====
export interface CertificateGameChallengeReference {
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

// ===== CERTIFICATE MATCH REFERENCE =====
export interface CertificateMatchReference {
  _id: string;
  status: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
  players: Array<{
    _id: string;
    userName: string;
    avatar?: string;
  }>;
  winner?: {
    _id: string;
    userName: string;
  };
  loser?: {
    _id: string;
    userName: string;
  };
}

// ===== CERTIFICATE REQUEST TYPES =====
export interface CreateCertificateRequest {
  certName: string;
  certDescription: string;
  gameChallengeId: string;
  matchId: string;
}

export interface UpdateCertificateRequest {
  certName?: string;
  certDescription?: string;
  gameChallengeId?: string;
  matchId?: string;
}

// ===== CERTIFICATE RESPONSE TYPES =====
export interface CertificateListResponse {
  certificates: CertificateWithDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCertificates: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CertificateStatsResponse {
  totalCertificates: number;
  certificatesByChallenge: Array<{
    challengeTitle: string;
    count: number;
  }>;
  certificatesByDifficulty: Array<{
    difficulty: string;
    count: number;
  }>;
  recentCertificates: Certificate[];
}

// ===== CERTIFICATE QUERY PARAMS =====
export interface CertificateQueryParams {
  page?: number;
  limit?: number;
  gameChallengeId?: string;
  matchId?: string;
  userId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  search?: string;
}

// ===== CERTIFICATE FORM TYPES =====
export interface CertificateForm {
  certName: string;
  certDescription: string;
  gameChallengeId: string;
  matchId: string;
}

export interface CertificateSearchForm {
  search: string;
  gameChallengeId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// ===== CERTIFICATE VALIDATION =====
export interface CertificateValidation {
  isValid: boolean;
  errors: string[];
}

// ===== CERTIFICATE STATS =====
export interface CertificateStats {
  totalCertificates: number;
  certificatesByChallenge: Array<{
    challengeTitle: string;
    count: number;
  }>;
  certificatesByDifficulty: Array<{
    difficulty: string;
    count: number;
  }>;
  recentCertificates: Certificate[];
}

// ===== CERTIFICATE ANALYTICS =====
export interface CertificateAnalytics {
  certificateId: string;
  challengeTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalEarned: number;
  averageCompletionTime: number;
  successRate: number;
}

export interface CertificateAnalyticsResponse {
  analytics: CertificateAnalytics[];
  summary: {
    totalCertificates: number;
    totalEarned: number;
    averageSuccessRate: number;
    averageCompletionTime: number;
  };
}

// ===== CERTIFICATE FILTERS =====
export interface CertificateFilters {
  gameChallengeId?: string;
  matchId?: string;
  userId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  page?: number;
  limit?: number;
  search?: string;
}

// ===== CERTIFICATE ACHIEVEMENT =====
export interface CertificateAchievement {
  userId: string;
  certificateId: string;
  earnedAt: string;
  score: number;
  completionTime: number;
}

export interface CertificateAchievementResponse {
  achievements: CertificateAchievement[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAchievements: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== USER CERTIFICATE PROGRESS =====
export interface UserCertificateProgress {
  userId: string;
  totalCertificates: number;
  earnedCertificates: number;
  inProgressCertificates: number;
  averageScore: number;
  totalCompletionTime: number;
  progressByDifficulty: Array<{
    difficulty: string;
    earned: number;
    total: number;
    percentage: number;
  }>;
}
