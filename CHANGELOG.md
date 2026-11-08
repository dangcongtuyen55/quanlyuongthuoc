# Nhật ký thay đổi (CHANGELOG)

## [1.0.0] - 2026-11-08

### Khởi tạo dự án (Bootstrap)
- **Thiết kế & Design Tokens**:
  - Trích xuất toàn bộ bảng màu chuẩn Material 3 Tonal Palette từ Google Stitch vào `src/theme/colors.ts`.
  - Thiết lập Typography cỡ chữ to rõ (tối thiểu 16sp) vào `src/theme/typography.ts`.
  - Thiết lập Spacing & Vùng chạm nút lớn (56dp) vào `src/theme/spacing.ts`.
- **Cơ sở dữ liệu Supabase & Bảo mật**:
  - Cấu hình Supabase client duy nhất với `expo-secure-store` tại `src/lib/supabase.ts`.
  - Tạo file migration `supabase/migrations/0001_init.sql` gồm các bảng `medications`, `schedules`, `dose_logs`.
  - Bật Row Level Security (RLS) cho toàn bộ các bảng, chỉ cho phép chủ tài khoản (`auth.uid()`) thao tác.
  - Cấu hình file `.env` và mẫu `.env.example` (bỏ `.env` khỏi git).
- **Hệ thống Thông báo & Báo thức Cục bộ (Local Notification)**:
  - Khởi tạo Kênh thông báo Android (Notification Channel) với độ ưu tiên cao tại `src/lib/notifications.ts`.
  - Đăng ký 2 nút bấm nhanh trực tiếp trên thông báo Android: "✓ Đã uống" và "⏰ Nhắc lại sau 15 phút".
  - Hỗ trợ lên lịch nhắc nhở lặp hàng ngày theo giờ uống thuốc.
- **Khung Điều hướng & Giao diện (Expo Router)**:
  - Màn hình Đăng nhập (`app/(auth)/login.tsx`): Đăng nhập Supabase Auth & Sinh trắc học vân tay/khuôn mặt.
  - Màn hình Hôm nay (`app/(tabs)/index.tsx`): Lời chào buổi sáng, thanh tiến độ 2/3 khung giờ, thẻ khung giờ Sáng (08:00), Trưa (12:30), Tối (19:00), nút to 1 chạm xác nhận đã uống.
  - Màn hình Tủ thuốc (`app/(tabs)/medications.tsx`): Danh sách thuốc, liều lượng, cảnh báo sắp hết thuốc.
  - Màn hình Lịch sử (`app/(tabs)/history.tsx`): Thống kê tỷ lệ tuân thủ 92% và nhật ký từng ngày.
  - Màn hình Cài đặt (`app/(tabs)/settings.tsx`): Đổi giờ các buổi, kiểm tra chuông báo thức, hướng dẫn chống tắt ngầm (pin), khoá vân tay, đăng xuất.
  - Màn hình Thêm thuốc mới (`app/medication/new.tsx`) & Chi tiết thuốc (`app/medication/[id].tsx`).
- **Cấu hình Đóng gói APK**:
  - Cấu hình `app.json` xin quyền `POST_NOTIFICATIONS`, `SCHEDULE_EXACT_ALARM`, `RECEIVE_BOOT_COMPLETED`, `USE_BIOMETRIC`.
  - Cấu hình `eas.json` để build ra file `.apk` cài trực tiếp (sideload).

