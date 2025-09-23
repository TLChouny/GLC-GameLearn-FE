import type { User } from './user';
import type { GameChallenge } from './gameChallenge';
import type { Match } from './match';
import type { Item, HouseDecoration } from './item';
import type { Ranking } from './ranking';

// Auth Store
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: unknown) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

// User Store
export interface UserState {
  users: User[];
  currentUser: User | null;
  friends: User[];
  isLoading: boolean;
  error: string | null;
}

export interface UserActions {
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addFriend: (friendId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  clearError: () => void;
}

export type UserStore = UserState & UserActions;

// Game Store
export interface GameState {
  challenges: GameChallenge[];
  matches: Match[];
  currentMatch: Match | null;
  isLoading: boolean;
  error: string | null;
}

export interface GameActions {
  fetchChallenges: (filters?: unknown) => Promise<void>;
  createChallenge: (challengeData: unknown) => Promise<void>;
  fetchMatches: (userId?: string) => Promise<void>;
  createMatch: (matchData: unknown) => Promise<void>;
  updateMatchStatus: (matchId: string, status: unknown) => Promise<void>;
  joinMatch: (matchId: string) => Promise<void>;
  leaveMatch: (matchId: string) => Promise<void>;
  clearError: () => void;
}

export type GameStore = GameState & GameActions;

// Item Store
export interface ItemState {
  items: Item[];
  houseDecorations: HouseDecoration[];
  userInventory: Item[];
  shoppingCart: Item[];
  isLoading: boolean;
  error: string | null;
}

export interface ItemActions {
  fetchItems: (filters?: unknown) => Promise<void>;
  createItem: (itemData: unknown) => Promise<void>;
  updateItem: (id: string, data: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  fetchHouseDecorations: () => Promise<void>;
  createHouseDecoration: (data: unknown) => Promise<void>;
  fetchUserInventory: () => Promise<void>;
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  purchaseItems: () => Promise<void>;
  clearError: () => void;
}

export type ItemStore = ItemState & ItemActions;

// Ranking Store
export interface RankingState {
  rankings: Ranking[];
  currentSeason: string;
  userRanking: Ranking | null;
  leaderboard: Ranking[];
  isLoading: boolean;
  error: string | null;
}

export interface RankingActions {
  fetchRankings: (season: string, page?: number) => Promise<void>;
  fetchTopRankings: (season: string, limit?: number) => Promise<void>;
  fetchUserRanking: (userId: string, season: string) => Promise<void>;
  updateRanking: (data: unknown) => Promise<void>;
  fetchSeasons: () => Promise<void>;
  setCurrentSeason: (season: string) => void;
  clearError: () => void;
}

export type RankingStore = RankingState & RankingActions;

// UI Store
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  modalOpen: boolean;
  currentModal: string | null;
  notifications: Notification[];
  loading: {
    [key: string]: boolean;
  };
}

export interface UIActions {
  toggleTheme: () => void;
  toggleSidebar: () => void;
  openModal: (modalType: string) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setLoading: (key: string, loading: boolean) => void;
}

export type UIStore = UIState & UIActions;

// Notification
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Combined Store
export interface RootState {
  auth: AuthState;
  user: UserState;
  game: GameState;
  item: ItemState;
  ranking: RankingState;
  ui: UIState;
}

// Store Actions
export interface RootActions {
  auth: AuthActions;
  user: UserActions;
  game: GameActions;
  item: ItemActions;
  ranking: RankingActions;
  ui: UIActions;
}

export type RootStore = RootState & RootActions;

// Persist configuration
export interface PersistConfig {
  key: string;
  storage: unknown;
  whitelist?: string[];
  blacklist?: string[];
}

// Store middleware
export interface StoreMiddleware {
  name: string;
  middleware: (store: unknown) => (next: unknown) => (action: unknown) => unknown;
}

// DevTools configuration
export interface DevToolsConfig {
  name: string;
  trace: boolean;
  traceLimit: number;
}
