# Frontend Types Documentation

## 📁 Cấu trúc Types

Các file types được tổ chức theo từng model riêng biệt để dễ dàng maintain và mở rộng.

### 🗂️ Danh sách Files

| File | Mô tả | Backend Model |
|------|-------|---------------|
| `base.ts` | Base types, enums, và interfaces chung | - |
| `user.ts` | User types và authentication | `User.ts` |
| `subject.ts` | Subject types | `Subject.ts` |
| `lesson.ts` | Lesson types | `Lesson.ts` |
| `gameChallenge.ts` | Game Challenge types | `GameChallenge.ts` |
| `match.ts` | Match types | `Match.ts` |
| `item.ts` | Item, HouseDecor, Trade types | `Item.ts`, `HouseDecor.ts`, `Trade.ts` |
| `certificate.ts` | Certificate types | `Certificate.ts` |
| `trade.ts` | Trade types riêng biệt | `Trade.ts` |
| `ranking.ts` | Ranking types | `Ranking.ts` |
| `houseDecor.ts` | House Decor types riêng biệt | `HouseDecor.ts` |
| `luckyWheel.ts` | Lucky Wheel types | `LuckyWheel.ts`, `LuckyWheelPrize.ts`, `LuckyWheelSpin.ts` |
| `api.ts` | API endpoints và response types | - |
| `ui.ts` | UI component types | - |
| `store.ts` | State management types | - |
| `index.ts` | Export tất cả types | - |

### 🎯 Cấu trúc mỗi file types

Mỗi file types bao gồm:

#### 1. **Entity Types**
```typescript
export interface ModelName extends BaseEntity {
  // Các fields chính của model
}
```

#### 2. **Request Types**
```typescript
export interface CreateModelRequest {
  // Fields cần thiết để tạo mới
}

export interface UpdateModelRequest {
  // Fields có thể cập nhật (optional)
}
```

#### 3. **Response Types**
```typescript
export interface ModelListResponse {
  models: ModelName[];
  pagination: PaginationInfo;
}

export interface ModelStatsResponse {
  // Thống kê và analytics
}
```

#### 4. **Query Params**
```typescript
export interface ModelQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  // Các filter khác
}
```

#### 5. **Form Types**
```typescript
export interface ModelForm {
  // Cấu trúc form data
}

export interface ModelSearchForm {
  // Cấu trúc search form
}
```

#### 6. **Validation Types**
```typescript
export interface ModelValidation {
  isValid: boolean;
  errors: string[];
}
```

#### 7. **Stats & Analytics**
```typescript
export interface ModelStats {
  // Thống kê tổng quan
}

export interface ModelAnalytics {
  // Phân tích chi tiết
}
```

### 🔗 Relationships

#### User Model
- Liên kết với: `Item`, `HouseDecor`, `GameChallenge`, `Match`, `Certificate`
- References: `listFriend` (User[])

#### Subject Model  
- Liên kết với: `Lesson`, `GameChallenge`
- References: `lessonId` (Lesson[])

#### GameChallenge Model
- Liên kết với: `Subject`, `Match`, `Certificate`
- References: `subjectId` (Subject)

#### Match Model
- Liên kết với: `User`, `GameChallenge`, `Trade`
- References: `players` (User[]), `gameChallengeId` (GameChallenge)

#### Item Model
- Liên kết với: `User`, `HouseDecor`, `Trade`, `LuckyWheelPrize`
- References: `itemId` trong các models khác

#### LuckyWheel Models
- `LuckyWheel` → `LuckyWheelPrize` → `LuckyWheelSpin`
- Liên kết với: `User`, `Item`

### 📝 Cách sử dụng

#### Import từ file riêng biệt:
```typescript
import { User, CreateUserRequest, UserListResponse } from '../types/user';
import { Subject, CreateSubjectRequest } from '../types/subject';
```

#### Import từ index (khuyến nghị):
```typescript
import { 
  User, 
  CreateUserRequest, 
  UserListResponse,
  Subject,
  CreateSubjectRequest 
} from '../types';
```

### 🎨 Naming Conventions

- **Entity Types**: `ModelName` (VD: `User`, `Subject`)
- **Request Types**: `CreateModelRequest`, `UpdateModelRequest`
- **Response Types**: `ModelListResponse`, `ModelStatsResponse`
- **Form Types**: `ModelForm`, `ModelSearchForm`
- **Validation Types**: `ModelValidation`
- **Stats Types**: `ModelStats`, `ModelAnalytics`
- **Reference Types**: `ModelReference`
- **With Details Types**: `ModelWithDetails`

### 🔄 Updates

Khi backend models thay đổi:
1. Cập nhật interface tương ứng trong file types
2. Thêm/bớt request/response types nếu cần
3. Cập nhật relationships và references
4. Test lại để đảm bảo không có lỗi linting

### 📋 Checklist

- [x] Tất cả 13 backend models đã có types tương ứng
- [x] Không có xung đột tên types
- [x] Relationships được định nghĩa đúng
- [x] Request/Response types đầy đủ
- [x] Form và validation types
- [x] Stats và analytics types
- [x] Không có lỗi linting
- [x] Documentation đầy đủ