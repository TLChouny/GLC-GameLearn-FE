# Cấu hình môi trường cho Frontend

## Tạo file .env.local

Trong thư mục `FE/frontend`, tạo file `.env.local` với nội dung:

```env
VITE_API_URL=http://localhost:5000/api
```

## Cách tạo file:

### Windows:
1. Mở Command Prompt hoặc PowerShell
2. Chạy lệnh:
```cmd
cd FE/frontend
echo VITE_API_URL=http://localhost:5000/api > .env.local
```

### Hoặc tạo thủ công:
1. Mở thư mục `FE/frontend`
2. Tạo file mới tên `.env.local`
3. Copy nội dung trên vào file

## Kiểm tra cấu hình:
Sau khi tạo file, khởi động lại frontend:
```cmd
cd FE/frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173
Backend API sẽ chạy tại: http://localhost:5000/api
