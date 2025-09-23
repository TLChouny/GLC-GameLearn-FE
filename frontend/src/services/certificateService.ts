import apiService from './api';
import type {
  Certificate,
  CertificateWithDetails,
  CreateCertificateRequest,
  UpdateCertificateRequest,
  CertificateListResponse,
  CertificateQueryParams,
  ApiResponse
} from '../types';

class CertificateService {
  // ===== CERTIFICATE CRUD =====
  async createCertificate(data: CreateCertificateRequest): Promise<ApiResponse<Certificate>> {
    return apiService.post('/certificates', data);
  }

  async getAllCertificates(params?: CertificateQueryParams): Promise<ApiResponse<CertificateListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/certificates?${queryParams.toString()}`);
  }

  async getCertificateById(id: string): Promise<ApiResponse<CertificateWithDetails>> {
    return apiService.get(`/certificates/${id}`);
  }

  async updateCertificate(id: string, data: UpdateCertificateRequest): Promise<ApiResponse<Certificate>> {
    return apiService.put(`/certificates/${id}`, data);
  }

  async deleteCertificate(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/certificates/${id}`);
  }

  // ===== SPECIALIZED QUERIES =====
  async getUserCertificates(userId: string, params?: CertificateQueryParams): Promise<ApiResponse<CertificateListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/certificates/user/${userId}?${queryParams.toString()}`);
  }

  async getCertificatesByMatch(matchId: string, params?: CertificateQueryParams): Promise<ApiResponse<CertificateListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiService.get(`/certificates/match/${matchId}?${queryParams.toString()}`);
  }

  // ===== UTILITY METHODS =====
  async getUserCertificateCount(userId: string): Promise<number> {
    try {
      const response = await this.getUserCertificates(userId, { limit: 1 });
      return response.data?.pagination.totalCertificates || 0;
    } catch {
      return 0;
    }
  }

  async getCertificatesByGameChallenge(gameChallengeId: string): Promise<CertificateWithDetails[]> {
    try {
      const response = await this.getAllCertificates({ gameChallengeId });
      return response.data?.certificates || [];
    } catch {
      return [];
    }
  }

  async searchCertificates(query: string): Promise<CertificateWithDetails[]> {
    try {
      const response = await this.getAllCertificates({ search: query });
      return response.data?.certificates || [];
    } catch {
      return [];
    }
  }

  // ===== VALIDATION HELPERS =====
  validateCertificateData(data: CreateCertificateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.certName || data.certName.trim().length === 0) {
      errors.push('Tên chứng chỉ là bắt buộc');
    }

    if (!data.certDescription || data.certDescription.trim().length === 0) {
      errors.push('Mô tả chứng chỉ là bắt buộc');
    }

    if (!data.gameChallengeId) {
      errors.push('ID thử thách trò chơi là bắt buộc');
    }

    if (!data.matchId) {
      errors.push('ID trận đấu là bắt buộc');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ===== ANALYTICS HELPERS =====
  async getCertificateStats(userId?: string): Promise<{
    totalCertificates: number;
    certificatesByType: Array<{ type: string; count: number }>;
    recentCertificates: Certificate[];
  } | null> {
    try {
      const params = userId ? { userId } : {};
      const response = await this.getAllCertificates(params);

      if (response.success && response.data) {
        const certificates = response.data.certificates;
        const totalCertificates = response.data.pagination.totalCertificates;

        // Group by type (assuming we can extract type from certName or description)
        const typeMap = new Map<string, number>();
        certificates.forEach(cert => {
          // Simple type extraction - can be improved based on actual data structure
          const type = cert.certName.split(' ')[0] || 'Unknown';
          typeMap.set(type, (typeMap.get(type) || 0) + 1);
        });

        const certificatesByType = Array.from(typeMap.entries()).map(([type, count]) => ({
          type,
          count
        }));

        // Get recent certificates (last 5)
        const recentCertificates = certificates
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        return {
          totalCertificates,
          certificatesByType,
          recentCertificates: recentCertificates as unknown as Certificate[]
        };
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Create singleton instance
const certificateService = new CertificateService();

export default certificateService;
