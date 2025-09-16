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

// Combined API endpoints
export interface ApiEndpoints extends 
  AuthApiEndpoints,
  UserApiEndpoints,
  GameApiEndpoints,
  ItemApiEndpoints,
  RankingApiEndpoints {
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
