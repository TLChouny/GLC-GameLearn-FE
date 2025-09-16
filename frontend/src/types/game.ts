import type { BaseEntity, Difficulty, MatchStatus } from './base';

// Subject Entity
export interface Subject extends BaseEntity {
  subjectName: string;
  subjectDescription: string;
  subjectUnit: string;
  lessonId?: string[];
}

// Lesson Entity
export interface Lesson extends BaseEntity {
  lessonName: string;
  lessonDescription: string;
  lessonNumber: number;
  lessonQuestion: string;
  lessonAnswer: string;
}

// Game Challenge Entity
export interface GameChallenge extends BaseEntity {
  title: string;
  subjectId: string;
  difficulty: Difficulty;
  rewardPoints: number;
}

// Game Challenge with populated subject
export interface GameChallengeWithSubject extends Omit<GameChallenge, 'subjectId'> {
  subjectId: Subject;
}

// Match Entity
export interface Match extends BaseEntity {
  players: string[];
  gameChallengeId: string;
  status: MatchStatus;
  winner?: string;
  loser?: string;
}

// Match with populated data
export interface MatchWithDetails extends Omit<Match, 'players' | 'gameChallengeId' | 'winner' | 'loser'> {
  players: GameUserReference[];
  gameChallengeId: GameChallengeWithSubject;
  winner?: GameUserReference;
  loser?: GameUserReference;
}

// User reference for matches
export interface GameUserReference {
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

// Certificate Entity
export interface Certificate extends BaseEntity {
  certName: string;
  certDescription: string;
  gameChallengeId: string;
  matchId: string;
}

// Certificate with populated data
export interface CertificateWithDetails extends Omit<Certificate, 'gameChallengeId' | 'matchId'> {
  gameChallengeId: GameChallengeWithSubject;
  matchId: MatchWithDetails;
}

// Request types
export interface CreateGameChallengeRequest {
  title: string;
  subjectId: string;
  difficulty: Difficulty;
  rewardPoints: number;
}

export interface CreateMatchRequest {
  players: string[];
  gameChallengeId: string;
}

export interface UpdateMatchStatusRequest {
  status: MatchStatus;
  winner?: string;
  loser?: string;
}

export interface CreateCertificateRequest {
  certName: string;
  certDescription: string;
  gameChallengeId: string;
  matchId: string;
}

// Response types
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

export interface CertificateListResponse {
  certificates: CertificateWithDetails[];
}

// Filter types
export interface GameChallengeFilters {
  difficulty?: Difficulty;
  subjectId?: string;
  page?: number;
  limit?: number;
}

export interface MatchFilters {
  status?: MatchStatus;
  userId?: string;
  page?: number;
  limit?: number;
}
