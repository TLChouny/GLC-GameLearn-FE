import apiService from './api';
import type {
  Subject,
  SubjectWithLessons,
  Lesson,
  CreateSubjectRequest,
  UpdateSubjectRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  SubjectListResponse,
  LessonListResponse,
  SubjectQueryParams,
  LessonQueryParams,
  ApiResponse
} from '../types';

class SubjectService {
  // ===== SUBJECT CRUD =====
  async createSubject(data: CreateSubjectRequest): Promise<ApiResponse<Subject>> {
    return apiService.post('/subjects', data);
  }

  async getAllSubjects(params?: SubjectQueryParams): Promise<ApiResponse<SubjectListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/subjects?${queryParams.toString()}`);
  }

  async getSubjectById(id: string): Promise<ApiResponse<SubjectWithLessons>> {
    return apiService.get(`/subjects/${id}`);
  }

  async updateSubject(id: string, data: UpdateSubjectRequest): Promise<ApiResponse<Subject>> {
    return apiService.put(`/subjects/${id}`, data);
  }

  async deleteSubject(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/subjects/${id}`);
  }

  // ===== LESSON CRUD =====
  async createLesson(data: CreateLessonRequest): Promise<ApiResponse<Lesson>> {
    return apiService.post('/lessons', data);
  }

  async getAllLessons(params?: LessonQueryParams): Promise<ApiResponse<LessonListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/lessons?${queryParams.toString()}`);
  }

  async getLessonById(id: string): Promise<ApiResponse<Lesson>> {
    return apiService.get(`/lessons/${id}`);
  }

  async updateLesson(id: string, data: UpdateLessonRequest): Promise<ApiResponse<Lesson>> {
    return apiService.put(`/lessons/${id}`, data);
  }

  async deleteLesson(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/lessons/${id}`);
  }

  async getLessonsBySubject(subjectId: string, params?: LessonQueryParams): Promise<ApiResponse<LessonListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/subjects/${subjectId}/lessons?${queryParams.toString()}`);
  }

  // ===== UTILITY METHODS =====
  async getSubjectWithLessons(subjectId: string): Promise<SubjectWithLessons | null> {
    try {
      const [subjectResponse, lessonsResponse] = await Promise.all([
        this.getSubjectById(subjectId),
        this.getLessonsBySubject(subjectId)
      ]);

      if (subjectResponse.success && lessonsResponse.success) {
        return {
          ...subjectResponse.data!,
          lessonId: lessonsResponse.data!.lessons
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  async searchSubjects(query: string): Promise<SubjectWithLessons[]> {
    try {
      const response = await this.getAllSubjects({ search: query });
      return response.data?.subjects || [];
    } catch {
      return [];
    }
  }

  async searchLessons(query: string, subjectId?: string): Promise<Lesson[]> {
    try {
      const response = await this.getAllLessons({ 
        search: query, 
        subjectId 
      });
      return response.data?.lessons || [];
    } catch {
      return [];
    }
  }

  // ===== VALIDATION HELPERS =====
  validateLessonNumber(lessonNumber: number, existingLessons: Lesson[]): boolean {
    return !existingLessons.some(lesson => lesson.lessonNumber === lessonNumber);
  }

  getNextLessonNumber(subjectId: string): Promise<number> {
    return this.getLessonsBySubject(subjectId)
      .then(response => {
        if (response.success && response.data?.lessons) {
          const maxNumber = Math.max(...response.data.lessons.map(lesson => lesson.lessonNumber));
          return maxNumber + 1;
        }
        return 1;
      })
      .catch(() => 1);
  }
}

// Create singleton instance
const subjectService = new SubjectService();

export default subjectService;
