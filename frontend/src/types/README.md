# TypeScript Types Documentation

Bộ types đầy đủ cho Game Learning Frontend, được tạo dựa trên backend MongoDB models.

## Cấu trúc Types

### 📁 `base.ts` - Types cơ bản
- `BaseEntity` - Interface chung cho tất cả entities
- `ApiResponse<T>` - Response format từ API
- `PaginationInfo` - Thông tin phân trang
- Enums: `UserRole`, `Gender`, `Difficulty`, `ItemType`, `MatchStatus`
- Utility types: `Optional<T, K>`, `RequiredFields<T, K>`

### 📁 `user.ts` - User & Authentication
- `User` - Entity người dùng
- `UserWithDetails` - User với các reference được populate
- `UserStats` - Thống kê người dùng
- `LoginRequest`, `RegisterRequest` - Request types
- `AuthResponse` - Response sau khi đăng nhập/đăng ký
- `UserReference` - Reference cho các entity khác

### 📁 `game.ts` - Game System
- `Subject`, `Lesson` - Môn học và bài học
- `GameChallenge` - Thử thách game
- `Match` - Trận đấu
- `Certificate` - Chứng chỉ
- Request/Response types cho tất cả game operations
- Filter types cho search và pagination

### 📁 `item.ts` - Item & Trading System
- `Item` - Vật phẩm
- `HouseDecoration` - Trang trí nhà
- `Trade` - Giao dịch
- `ShoppingCart`, `UserInventory` - Giỏ hàng và kho đồ
- `ItemStats` - Thống kê items
- Filter types cho shop và inventory

### 📁 `ranking.ts` - Ranking System
- `Ranking` - Bảng xếp hạng
- `Leaderboard` - Bảng xếp hạng chi tiết
- `Season` - Mùa giải
- `Achievement` - Thành tích
- `UserRankingHistory` - Lịch sử xếp hạng của user
- Comparison và statistics types

### 📁 `api.ts` - API Configuration
- `ApiClient` - Interface cho API client
- `ApiEndpoints` - Tất cả API endpoints
- `ApiRequest`, `ApiResponse` - Request/Response types
- Error types: `NetworkError`, `ValidationError`, etc.
- WebSocket types cho real-time features
- File upload và interceptor types

### 📁 `ui.ts` - UI Components
- Component props: `ButtonProps`, `ModalProps`, `InputProps`
- Table và form types
- Theme và layout types
- Game UI components
- Chart và notification types

### 📁 `store.ts` - State Management
- Zustand store interfaces
- `AuthStore`, `UserStore`, `GameStore`, `ItemStore`, `RankingStore`
- `UIStore` cho UI state
- `RootStore` - Combined store
- Persist và middleware configuration

## Cách sử dụng

### Import types
```typescript
import { User, GameChallenge, ApiResponse } from '@/types';
import type { LoginRequest, AuthResponse } from '@/types';
```

### Sử dụng với API calls
```typescript
import { ApiResponse, User } from '@/types';

const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await api.get('/api/users');
  return response.data;
};
```

### Sử dụng với Zustand store
```typescript
import { AuthStore } from '@/types';

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    // Implementation
  },
  // ... other actions
}));
```

### Sử dụng với React components
```typescript
import { ButtonProps, User } from '@/types';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  // Component implementation
};
```

## Type Safety Features

### 1. **Strict Typing**
- Tất cả API responses đều có type safety
- Request/Response types được validate
- Enum types cho các giá trị cố định

### 2. **Utility Types**
```typescript
// Tạo type với một số field optional
type PartialUser = Optional<User, 'avatar' | 'userDescription'>;

// Tạo type với một số field required
type RequiredUser = RequiredFields<User, 'email' | 'userName'>;
```

### 3. **Generic Types**
```typescript
// Paginated response cho bất kỳ entity nào
type PaginatedUsers = PaginatedApiResponse<User>;
type PaginatedItems = PaginatedApiResponse<Item>;
```

### 4. **Union Types**
```typescript
// API response có thể là success hoặc error
type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

## Best Practices

### 1. **Import chỉ những gì cần**
```typescript
// ✅ Good
import { User, LoginRequest } from '@/types';

// ❌ Avoid
import * as Types from '@/types';
```

### 2. **Sử dụng type assertions cẩn thận**
```typescript
// ✅ Good - với type guard
if (response.success) {
  const data = response.data; // TypeScript biết đây là success response
}

// ❌ Avoid - force casting
const data = response.data as User[];
```

### 3. **Extend types khi cần**
```typescript
interface ExtendedUser extends User {
  customField: string;
}
```

### 4. **Sử dụng utility types**
```typescript
// Tạo form data type từ entity
type UserFormData = Partial<Pick<User, 'userName' | 'email' | 'address'>>;
```

## Migration từ Backend

Khi backend có thay đổi, cập nhật types theo thứ tự:

1. **Models** - Cập nhật entity interfaces
2. **Controllers** - Cập nhật request/response types  
3. **Routes** - Cập nhật API endpoint types
4. **Frontend** - Cập nhật UI và store types

## Linting & Validation

Types được thiết kế để:
- ✅ Pass TypeScript strict mode
- ✅ Compatible với ESLint rules
- ✅ Support IntelliSense trong IDE
- ✅ Catch errors tại compile time
