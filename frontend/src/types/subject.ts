import type { BaseEntity } from './base';
import type { Lesson } from './lesson';

// ===== SUBJECT TYPES =====
export interface Subject extends BaseEntity {
  subjectName: string;
  subjectDescription: string;
  subjectUnit: string;
  lessonId?: string[];
}

// ===== SUBJECT WITH POPULATED DATA =====
export interface SubjectWithLessons extends Omit<Subject, 'lessonId'> {
  lessonId?: Lesson[];
}

// ===== LESSON REFERENCE =====
export interface LessonReference {
  _id: string;
  lessonName: string;
  lessonDescription: string;
  lessonNumber: number;
  lessonQuestion: string;
  lessonAnswer: string;
}

// ===== SUBJECT REQUEST TYPES =====
export interface CreateSubjectRequest {
  subjectName: string;
  subjectDescription: string;
  subjectUnit: string;
}

export interface UpdateSubjectRequest {
  subjectName?: string;
  subjectDescription?: string;
  subjectUnit?: string;
}

// ===== SUBJECT RESPONSE TYPES =====
export interface SubjectListResponse {
  subjects: SubjectWithLessons[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSubjects: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SubjectStatsResponse {
  totalSubjects: number;
  subjectsByUnit: Array<{
    unit: string;
    count: number;
  }>;
  averageLessonsPerSubject: number;
  recentSubjects: Subject[];
}

// ===== SUBJECT QUERY PARAMS =====
export interface SubjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  subjectUnit?: string;
}

// ===== SUBJECT FORM TYPES =====
export interface SubjectForm {
  subjectName: string;
  subjectDescription: string;
  subjectUnit: string;
}

export interface SubjectSearchForm {
  search: string;
  subjectUnit?: string;
}

// ===== SUBJECT VALIDATION =====
export interface SubjectValidation {
  isValid: boolean;
  errors: string[];
}

// ===== SUBJECT STATS =====
export interface SubjectStats {
  totalSubjects: number;
  subjectsByUnit: Array<{
    unit: string;
    count: number;
  }>;
  averageLessonsPerSubject: number;
  mostPopularSubjects: Subject[];
  recentSubjects: Subject[];
}

// ===== SUBJECT ANALYTICS =====
export interface SubjectAnalytics {
  subjectId: string;
  totalLessons: number;
  totalGameChallenges: number;
  totalMatches: number;
  averageDifficulty: 'easy' | 'medium' | 'hard';
  popularityScore: number;
}

export interface SubjectAnalyticsResponse {
  analytics: SubjectAnalytics[];
  summary: {
    totalSubjects: number;
    totalLessons: number;
    totalGameChallenges: number;
    averagePopularityScore: number;
  };
}
