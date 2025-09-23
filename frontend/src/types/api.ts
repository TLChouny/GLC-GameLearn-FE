import type { ApiResponse, ApiError, PaginationInfo } from './base';

// API Configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Request types
export interface ApiRequest {
  url: string;
  method: HttpMethod;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

// API Response types
export interface ApiSuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse extends ApiError {
  success: false;
}

export type ApiResponseType<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Paginated API Response
export interface PaginatedApiResponse<T> extends ApiSuccessResponse<T[]> {
  data: T[];
  pagination: PaginationInfo;
}

// Authentication API types
export interface AuthApiEndpoints {
  login: '/api/users/login';
  register: '/api/users/register';
  refresh: '/api/users/refresh';
  logout: '/api/users/logout';
}

// User API types
export interface UserApiEndpoints {
  getAll: '/api/users';
  getById: '/api/users/:id';
  update: '/api/users/:id';
  delete: '/api/users/:id';
  addFriend: '/api/users/add-friend';
  updatePoints: '/api/users/:id/points';
}

// Game API types
export interface GameApiEndpoints {
  createChallenge: '/api/games/challenges';
  getChallenges: '/api/games/challenges';
  createMatch: '/api/games/matches';
  updateMatchStatus: '/api/games/matches/:id/status';
  getMatch: '/api/games/matches/:id';
  getUserMatches: '/api/games/users/:userId/matches';
  createCertificate: '/api/games/certificates';
  getUserCertificates: '/api/games/users/:userId/certificates';
}

// Item API types
export interface ItemApiEndpoints {
  createItem: '/api/items/items';
  getItems: '/api/items/items';
  getItem: '/api/items/items/:id';
  updateItem: '/api/items/items/:id';
  deleteItem: '/api/items/items/:id';
  createHouseDecoration: '/api/items/house-decorations';
  getHouseDecorations: '/api/items/house-decorations';
  createTrade: '/api/items/trades';
  getTradeHistory: '/api/items/trades/match/:matchId';
}

// Ranking API types
export interface RankingApiEndpoints {
  updateRanking: '/api/rankings/update';
  getRankingsBySeason: '/api/rankings/season/:season';
  getTopRankings: '/api/rankings/top/:season';
  getUserRanking: '/api/rankings/user/:userId/season/:season';
  getAllSeasons: '/api/rankings/seasons';
  updateAllRankings: '/api/rankings/update-all';
}

// Lucky Wheel API types
export interface LuckyWheelApiEndpoints {
  // LuckyWheel CRUD
  createWheel: '/api/lucky-wheels';
  getAllWheels: '/api/lucky-wheels';
  getWheelById: '/api/lucky-wheels/:id';
  updateWheel: '/api/lucky-wheels/:id';
  deleteWheel: '/api/lucky-wheels/:id';
  
  // LuckyWheelPrize CRUD
  createPrize: '/api/lucky-wheels/:wheelId/prizes';
  getPrizes: '/api/lucky-wheels/:wheelId/prizes';
  updatePrize: '/api/lucky-wheels/prizes/:id';
  deletePrize: '/api/lucky-wheels/prizes/:id';
  
  // LuckyWheelSpin Operations
  spinWheel: '/api/lucky-wheels/:wheelId/spin';
  getWheelInfo: '/api/lucky-wheels/:wheelId/info';
  getUserSpinHistory: '/api/lucky-wheels/user/history';
  getUserSpinHistoryByWheel: '/api/lucky-wheels/user/history/:wheelId';
  getUserSpinStats: '/api/lucky-wheels/user/stats';
  getUserSpinStatsByWheel: '/api/lucky-wheels/user/stats/:wheelId';
}

// Subject API types
export interface SubjectApiEndpoints {
  createSubject: '/api/subjects';
  getAllSubjects: '/api/subjects';
  getSubjectById: '/api/subjects/:id';
  updateSubject: '/api/subjects/:id';
  deleteSubject: '/api/subjects/:id';
  
  // Lesson CRUD
  createLesson: '/api/lessons';
  getAllLessons: '/api/lessons';
  getLessonById: '/api/lessons/:id';
  updateLesson: '/api/lessons/:id';
  deleteLesson: '/api/lessons/:id';
  getLessonsBySubject: '/api/subjects/:subjectId/lessons';
}

// Certificate API types
export interface CertificateApiEndpoints {
  createCertificate: '/api/certificates';
  getAllCertificates: '/api/certificates';
  getCertificateById: '/api/certificates/:id';
  updateCertificate: '/api/certificates/:id';
  deleteCertificate: '/api/certificates/:id';
  getUserCertificates: '/api/certificates/user/:userId';
  getCertificatesByMatch: '/api/certificates/match/:matchId';
}

// Trade API types
export interface TradeApiEndpoints {
  createTrade: '/api/trades';
  getAllTrades: '/api/trades';
  getTradeById: '/api/trades/:id';
  updateTrade: '/api/trades/:id';
  deleteTrade: '/api/trades/:id';
  getTradesByMatch: '/api/trades/match/:matchId';
  getUserTrades: '/api/trades/user/:userId';
}

// House Decor API types
export interface HouseDecorApiEndpoints {
  createHouseDecor: '/api/house-decorations';
  getAllHouseDecorations: '/api/house-decorations';
  getHouseDecorById: '/api/house-decorations/:id';
  updateHouseDecor: '/api/house-decorations/:id';
  deleteHouseDecor: '/api/house-decorations/:id';
  getUserHouseDecorations: '/api/house-decorations/user/:userId';
}

// Combined API endpoints
export interface ApiEndpoints extends 
  AuthApiEndpoints,
  UserApiEndpoints,
  RankingApiEndpoints,
  LuckyWheelApiEndpoints,
  SubjectApiEndpoints,
  CertificateApiEndpoints,
  TradeApiEndpoints,
  HouseDecorApiEndpoints {
  health: '/health';
}

// API Error types
export interface NetworkError {
  type: 'NETWORK_ERROR';
  message: string;
  status?: number;
}

export interface ApiValidationError {
  type: 'VALIDATION_ERROR';
  field: string;
  message: string;
}

export interface AuthenticationError {
  type: 'AUTHENTICATION_ERROR';
  message: string;
}

export interface AuthorizationError {
  type: 'AUTHORIZATION_ERROR';
  message: string;
}

export interface ServerError {
  type: 'SERVER_ERROR';
  message: string;
  status: number;
}

export type ApiErrorType = 
  | NetworkError
  | ApiValidationError
  | AuthenticationError
  | AuthorizationError
  | ServerError;

// API Client interface
export interface ApiClient {
  get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponseType<T>>;
  post<T>(url: string, data?: unknown): Promise<ApiResponseType<T>>;
  put<T>(url: string, data?: unknown): Promise<ApiResponseType<T>>;
  delete<T>(url: string): Promise<ApiResponseType<T>>;
  patch<T>(url: string, data?: unknown): Promise<ApiResponseType<T>>;
}

// Request interceptor
export interface RequestInterceptor {
  onRequest?: (config: ApiRequest) => ApiRequest | Promise<ApiRequest>;
  onRequestError?: (error: unknown) => Promise<unknown>;
}

// Response interceptor
export interface ResponseInterceptor {
  onResponse?: <T>(response: ApiResponseType<T>) => ApiResponseType<T> | Promise<ApiResponseType<T>>;
  onResponseError?: (error: unknown) => Promise<unknown>;
}

// API Client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

// Query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: unknown;
}

// File upload types
export interface FileUpload {
  file: File;
  fieldName: string;
  onProgress?: (progress: number) => void;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// WebSocket types
export interface WebSocketMessage<T = unknown> {
  type: string;
  data: T;
  timestamp: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// Real-time events
export interface RealtimeEvents {
  'match:created': { matchId: string; players: string[] };
  'match:updated': { matchId: string; status: string };
  'ranking:updated': { userId: string; newRank: number; season: string };
  'user:online': { userId: string; userName: string };
  'user:offline': { userId: string };
  'notification:new': { userId: string; message: string; type: string };
}
