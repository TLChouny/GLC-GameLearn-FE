import type { ReactNode } from 'react';

// UI Component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  className?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationProps;
  onRowClick?: (row: T) => void;
  className?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  showSizeChanger?: boolean;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => string | undefined;
  };
}

export interface FormData {
  [key: string]: unknown;
}

export interface FormErrors {
  [key: string]: string;
}

// Toast notification types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export type ThemeMode = 'light' | 'dark';

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  children?: NavItem[];
  badge?: number;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

// Layout types
export interface LayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  currentPath: string;
}

export interface HeaderProps {
  title?: string;
  user?: {
    name: string;
    avatar?: string;
    role: string;
  };
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

// Game UI types
export interface GameCanvasProps {
  width: number;
  height: number;
  onGameReady?: () => void;
  onGameEnd?: (score: number) => void;
}

export interface GameStatsProps {
  score: number;
  level: number;
  lives: number;
  timeLeft?: number;
}

export interface LeaderboardProps {
  entries: Array<{
    rank: number;
    userName: string;
    score: number;
    avatar?: string;
  }>;
  currentUserRank?: number;
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }>;
}

export interface ChartProps {
  data: ChartData;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  options?: unknown;
  className?: string;
}
