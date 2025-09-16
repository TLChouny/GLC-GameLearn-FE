import type { BaseEntity, Gender, UserRole } from './base';

// User Statistics
export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  averageScore: number;
}

// User Entity
export interface User extends BaseEntity {
  userName: string;
  email: string;
  password?: string; // Optional for responses
  gender: Gender;
  address: string;
  role: UserRole;
  avatar?: string;
  userDescription?: string;
  points: number;
  itemId?: string[];
  houseDecorId?: string[];
  gameChallengeId?: string[];
  matchId?: string[];
  certId?: string[];
  stats: UserStats;
  listFriend: string[];
  otp?: string;
  otpExpires?: string;
  isVerified: boolean;
  token?: string;
}

// User with populated references
export interface UserWithDetails extends Omit<User, 'itemId' | 'houseDecorId' | 'gameChallengeId' | 'matchId' | 'certId' | 'listFriend'> {
  itemId?: ItemReference[];
  houseDecorId?: HouseDecorationReference[];
  gameChallengeId?: GameChallengeReference[];
  matchId?: MatchReference[];
  certId?: CertificateReference[];
  listFriend?: UserReference[];
}

// User references for populated data
export interface UserReference {
  _id: string;
  userName: string;
  avatar?: string;
  points: number;
  stats?: UserStats;
}

export interface ItemReference {
  _id: string;
  itemName: string;
  itemType: string;
  itemPrice: number;
  itemImage?: string;
}

export interface HouseDecorationReference {
  _id: string;
  houseName: string;
  houseDescription: string;
}

export interface GameChallengeReference {
  _id: string;
  title: string;
  difficulty: string;
  rewardPoints: number;
}

export interface MatchReference {
  _id: string;
  status: string;
  winner?: string;
  loser?: string;
}

export interface CertificateReference {
  _id: string;
  certName: string;
  certDescription: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  gender: Gender;
  address: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: {
    id: string;
    userName: string;
    email: string;
    role: UserRole;
    points: number;
    avatar?: string;
    stats?: UserStats;
  };
  token: string;
}

// User update types
export interface UpdateUserRequest {
  userName?: string;
  gender?: Gender;
  address?: string;
  avatar?: string;
  userDescription?: string;
}

export interface AddFriendRequest {
  userId: string;
  friendId: string;
}

export interface UpdatePointsRequest {
  points: number;
}

// User list types
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
