// Base types và interfaces chung

export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Common types (replacing enums)
export const UserRole = {
  STUDENT: 'student',
  ADMIN: 'admin',
  TEACHER: 'teacher'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const Difficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

export const ItemType = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  CONSUMABLE: 'consumable',
  DECORATION: 'decoration',
  SPECIAL: 'special'
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

export const MatchStatus = {
  WAITING: 'waiting',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus];

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
