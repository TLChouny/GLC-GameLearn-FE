# Services Documentation

## Tổng quan

Thư mục `services` chứa tất cả các service để giao tiếp với API backend. Mỗi service được thiết kế để xử lý các operations cụ thể cho từng module.

## Cấu trúc

```
services/
├── api.ts                 # API client chính với axios
├── luckyWheelService.ts   # Service cho vòng quay may mắn
├── subjectService.ts      # Service cho môn học và bài học
├── certificateService.ts  # Service cho chứng chỉ
├── tradeService.ts        # Service cho giao dịch
├── houseDecorService.ts   # Service cho trang trí nhà cửa
├── index.ts              # Export tất cả services
└── README.md             # Tài liệu này
```

## Sử dụng

### Import Services

```typescript
import { 
  apiService, 
  luckyWheelService, 
  subjectService,
  certificateService,
  tradeService,
  houseDecorService 
} from '@/services';

// Hoặc import riêng lẻ
import { luckyWheelService } from '@/services/luckyWheelService';
```

### Lucky Wheel Service

```typescript
// Tạo vòng quay mới
const wheel = await luckyWheelService.createLuckyWheel({
  wheelTitle: 'Daily Lucky Wheel',
  wheelDescription: 'Spin daily to win amazing prizes!',
  maxSpinPerDay: 3
});

// Lấy danh sách vòng quay
const wheels = await luckyWheelService.getAllLuckyWheels({ page: 1, limit: 10 });

// Quay vòng quay
const spinResult = await luckyWheelService.spinLuckyWheel(wheelId);

// Lấy thông tin vòng quay với số lượt quay còn lại
const wheelInfo = await luckyWheelService.getWheelInfo(wheelId);
console.log(`Còn ${wheelInfo.remainingSpins} lượt quay`);

// Lấy lịch sử quay của user
const history = await luckyWheelService.getUserSpinHistory({ page: 1, limit: 10 });

// Lấy thống kê quay
const stats = await luckyWheelService.getUserSpinStats();
```

### Subject Service

```typescript
// Tạo môn học mới
const subject = await subjectService.createSubject({
  subjectName: 'Toán học',
  subjectDescription: 'Môn học về số học và hình học',
  subjectUnit: 'Unit 1'
});

// Lấy danh sách môn học
const subjects = await subjectService.getAllSubjects({ page: 1, limit: 10 });

// Tạo bài học mới
const lesson = await subjectService.createLesson({
  lessonName: 'Phép cộng cơ bản',
  lessonDescription: 'Học cách cộng các số từ 1-10',
  lessonNumber: 1,
  lessonQuestion: '2 + 3 = ?',
  lessonAnswer: '5'
});

// Lấy bài học theo môn học
const lessons = await subjectService.getLessonsBySubject(subjectId);
```

### Certificate Service

```typescript
// Tạo chứng chỉ mới
const certificate = await certificateService.createCertificate({
  certName: 'Chứng chỉ Toán học cơ bản',
  certDescription: 'Hoàn thành khóa học toán cơ bản',
  gameChallengeId: 'challenge_id',
  matchId: 'match_id'
});

// Lấy chứng chỉ của user
const userCerts = await certificateService.getUserCertificates(userId);

// Lấy thống kê chứng chỉ
const stats = await certificateService.getCertificateStats(userId);
```

### Trade Service

```typescript
// Tạo giao dịch mới
const trade = await tradeService.createTrade({
  matchId: 'match_id',
  itemTaken: 'item_id',
  bookingId: 'booking_id' // optional
});

// Lấy lịch sử giao dịch của user
const userTrades = await tradeService.getUserTrades(userId);

// Lấy giao dịch theo trận đấu
const matchTrades = await tradeService.getTradesByMatch(matchId);
```

### House Decor Service

```typescript
// Tạo trang trí nhà mới
const houseDecor = await houseDecorService.createHouseDecor({
  houseName: 'Nhà gỗ cổ điển',
  houseDescription: 'Ngôi nhà với phong cách cổ điển',
  itemId: ['item1', 'item2', 'item3']
});

// Lấy trang trí nhà của user
const userDecorations = await houseDecorService.getUserHouseDecorations(userId);

// Tìm kiếm trang trí nhà
const searchResults = await houseDecorService.searchHouseDecorations('gỗ');
```

## Error Handling

Tất cả services đều trả về response với format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}
```

### Xử lý lỗi

```typescript
try {
  const result = await luckyWheelService.spinLuckyWheel(wheelId);
  if (result.success) {
    console.log('Quay thành công:', result.data);
  } else {
    console.error('Lỗi:', result.message);
  }
} catch (error) {
  console.error('Lỗi network:', error);
}
```

## Validation

Các service có built-in validation helpers:

```typescript
// Lucky Wheel
const isValid = luckyWheelService.validatePrizeProbability(prizes);

// Subject
const canCreateLesson = subjectService.validateLessonNumber(lessonNumber, existingLessons);

// Certificate
const validation = certificateService.validateCertificateData(data);
if (!validation.isValid) {
  console.error('Lỗi validation:', validation.errors);
}
```

## Analytics & Stats

Các service cung cấp methods để lấy thống kê:

```typescript
// Lucky Wheel analytics
const analytics = await luckyWheelService.getWheelAnalytics(wheelId);

// Certificate stats
const certStats = await certificateService.getCertificateStats(userId);

// Trade stats
const tradeStats = await tradeService.getTradeStats(userId);

// House decor stats
const decorStats = await houseDecorService.getHouseDecorStats(userId);
```

## Query Parameters

Tất cả services hỗ trợ pagination và filtering:

```typescript
// Pagination
const params = { page: 1, limit: 10 };

// Search
const searchParams = { search: 'keyword' };

// Filtering
const filterParams = { 
  itemType: 'weapon', 
  minPrice: 100, 
  maxPrice: 500 
};
```

## Best Practices

1. **Luôn kiểm tra success flag** trước khi sử dụng data
2. **Sử dụng try-catch** để xử lý lỗi
3. **Cache data** khi cần thiết để tránh gọi API nhiều lần
4. **Sử dụng validation helpers** trước khi gửi data
5. **Handle loading states** trong UI components

## TypeScript Support

Tất cả services đều có full TypeScript support với:
- Type safety cho request/response
- IntelliSense support
- Compile-time error checking
- Auto-completion

## Examples

Xem thêm examples trong các file service cụ thể hoặc trong components sử dụng các services này.
