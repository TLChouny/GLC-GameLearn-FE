import type { BaseEntity } from './base';

// ===== LESSON TYPES =====
export interface Lesson extends BaseEntity {
  lessonName: string;
  lessonDescription: string;
  lessonNumber: number;
  lessonQuestion: string;
  lessonAnswer: string;
}

// ===== LESSON WITH SUBJECT =====
export interface LessonWithSubject extends Lesson {
  subject?: {
    _id: string;
    subjectName: string;
    subjectDescription: string;
    subjectUnit: string;
  };
}

// ===== LESSON REQUEST TYPES =====
export interface CreateLessonRequest {
  lessonName: string;
  lessonDescription: string;
  lessonNumber: number;
  lessonQuestion: string;
  lessonAnswer: string;
}

export interface UpdateLessonRequest {
  lessonName?: string;
  lessonDescription?: string;
  lessonNumber?: number;
  lessonQuestion?: string;
  lessonAnswer?: string;
}

// ===== LESSON RESPONSE TYPES =====
export interface LessonListResponse {
  lessons: LessonWithSubject[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalLessons: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LessonStatsResponse {
  totalLessons: number;
  lessonsBySubject: Array<{
    subjectName: string;
    count: number;
  }>;
  averageQuestionsPerLesson: number;
  recentLessons: Lesson[];
}

// ===== LESSON QUERY PARAMS =====
export interface LessonQueryParams {
  page?: number;
  limit?: number;
  subjectId?: string;
  search?: string;
  lessonNumber?: number;
}

// ===== LESSON FORM TYPES =====
export interface LessonForm {
  lessonName: string;
  lessonDescription: string;
  lessonNumber: number;
  lessonQuestion: string;
  lessonAnswer: string;
}

export interface LessonSearchForm {
  search: string;
  subjectId?: string;
  lessonNumber?: number;
}

// ===== LESSON VALIDATION =====
export interface LessonValidation {
  isValid: boolean;
  errors: string[];
}

// ===== LESSON STATS =====
export interface LessonStats {
  totalLessons: number;
  lessonsBySubject: Array<{
    subjectName: string;
    count: number;
  }>;
  averageQuestionsPerLesson: number;
  recentLessons: Lesson[];
}

// ===== LESSON PROGRESS =====
export interface LessonProgress {
  lessonId: string;
  userId: string;
  isCompleted: boolean;
  score?: number;
  attempts: number;
  lastAttempted: string;
  timeSpent: number; // in minutes
}

export interface UserLessonProgress {
  userId: string;
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  averageScore: number;
  totalTimeSpent: number;
  progressBySubject: Array<{
    subjectId: string;
    subjectName: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
}

// ===== LESSON ANALYTICS =====
export interface LessonAnalytics {
  lessonId: string;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  averageTimeSpent: number;
  difficultyRating: number;
}

export interface LessonAnalyticsResponse {
  analytics: LessonAnalytics[];
  summary: {
    totalLessons: number;
    totalAttempts: number;
    averageCompletionRate: number;
    averageScore: number;
  };
}
