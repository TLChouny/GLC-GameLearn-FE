import type { BaseEntity } from './base';

// ===== USER TYPES =====
export interface User extends BaseEntity {
  userName: string;
  email: string;
  password?: string; // Optional for auth context
  gender: 'male' | 'female' | 'other';
  address: string;
  role: 'student' | 'admin' | 'teacher';
  avatar?: string;
  userDescription?: string;
  points: number;
  itemId?: string[];
  houseDecorId?: string[];
  gameChallengeId?: string[];
  matchId?: string[];
  certId?: string[];
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    totalScore: number;
    averageScore: number;
  };
  listFriend: string[];
  otp?: string;
  otpExpires?: string;
  isVerified: boolean;
  token?: string;
  oauth?: {
    googleId?: string;
    facebookId?: string;
    provider?: string;
  };
}

// ===== USER WITH POPULATED DATA =====
export interface UserWithDetails extends Omit<User, 'itemId' | 'houseDecorId' | 'gameChallengeId' | 'matchId' | 'certId' | 'listFriend'> {
  itemId?: ItemReference[];
  houseDecorId?: HouseDecorReference[];
  gameChallengeId?: GameChallengeReference[];
  matchId?: MatchReference[];
  certId?: CertificateReference[];
  listFriend: UserReference[];
}

// ===== USER REFERENCE TYPES =====
export interface UserReference {
  _id: string;
  userName: string;
  avatar?: string;
  points: number;
  role: 'student' | 'admin' | 'teacher';
  stats?: {
    gamesPlayed: number;
    gamesWon: number;
    totalScore: number;
    averageScore: number;
  };
}

export interface ItemReference {
  _id: string;
  itemName: string;
  itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  itemPrice: number;
  itemImage: string;
}

export interface HouseDecorReference {
  _id: string;
  houseName: string;
  houseDescription: string;
  itemId: string[];
}

export interface GameChallengeReference {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardPoints: number;
}

export interface MatchReference {
  _id: string;
  status: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
  players: string[];
  winner?: string;
  loser?: string;
}

export interface CertificateReference {
  _id: string;
  certName: string;
  certDescription: string;
}

// ===== USER REQUEST TYPES =====
export interface CreateUserRequest {
  userName: string;
  email: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  role?: 'student' | 'admin' | 'teacher';
  avatar?: string;
  userDescription?: string;
}

export interface UpdateUserRequest {
  userName?: string;
  email?: string;
  password?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  role?: 'student' | 'admin' | 'teacher';
  avatar?: string;
  userDescription?: string;
  points?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  address: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  userName?: string;
  avatar?: string;
  userDescription?: string;
  address?: string;
}

// ===== USER RESPONSE TYPES =====
export interface UserListResponse {
  users: UserWithDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AuthResponse {
  user: UserWithDetails;
  token: string;
  refreshToken?: string;
}

export interface UserStatsResponse {
  totalUsers: number;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  averagePoints: number;
  topUsers: UserReference[];
}

// ===== USER QUERY PARAMS =====
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'student' | 'admin' | 'teacher';
  gender?: 'male' | 'female' | 'other';
  minPoints?: number;
  maxPoints?: number;
}

// ===== USER FORM TYPES =====
export interface UserForm {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  role: 'student' | 'admin' | 'teacher';
  avatar?: string;
  userDescription?: string;
}

export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  agreeToTerms: boolean;
}

export interface ProfileForm {
  userName: string;
  avatar?: string;
  userDescription?: string;
  address: string;
}

// ===== USER VALIDATION =====
export interface UserValidation {
  isValid: boolean;
  errors: string[];
}

// ===== USER STATS =====
export interface UserStats {
  totalUsers: number;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  usersByGender: Array<{
    gender: string;
    count: number;
  }>;
  averagePoints: number;
  topUsers: UserReference[];
  recentUsers: UserReference[];
}

// ===== USER FRIENDSHIP =====
export interface FriendshipRequest {
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface FriendshipResponse {
  friendship: FriendshipRequest;
  fromUser: UserReference;
  toUser: UserReference;
}

// ===== USER ACTIVITY =====
export interface UserActivity {
  userId: string;
  activityType: 'login' | 'logout' | 'game_played' | 'item_purchased' | 'profile_updated';
  activityData: Record<string, any>;
  timestamp: string;
}

export interface UserActivityResponse {
  activities: UserActivity[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalActivities: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}