---
trigger: always_on
description: Quy tắc bảo mật bắt buộc (app cài bằng APK, chứa dữ liệu sức khoẻ)
---

# Quy tắc bảo mật

App chứa **dữ liệu sức khoẻ cá nhân** và được cài bằng APK nên ai có file APK
đều có thể giải nén ra xem. Vì vậy phải tuân thủ các điều sau.

## 1. Khoá và bí mật (secrets)
- Trong app **chỉ** được dùng `SUPABASE_URL` và `SUPABASE_ANON_KEY` (publishable key).
- **TUYỆT ĐỐI KHÔNG** đưa `service_role` key, mật khẩu database, hay API key bí mật
  vào code app, file `.env` của app, hay commit lên git.
- Biến môi trường dùng prefix `EXPO_PUBLIC_` chỉ để chứa thứ **được phép công khai**
  (vì nó sẽ nằm trong APK).
- `.env`, `*.keystore`, `*.jks`, `google-services.json` (nếu có) phải nằm trong `.gitignore`.
- Nếu cần gọi dịch vụ bên thứ ba cần key bí mật -> làm qua Supabase Edge Function,
  không gọi thẳng từ app.

## 2. Database: RLS là hàng rào chính
- **Mọi bảng** phải bật Row Level Security (`ENABLE ROW LEVEL SECURITY`).
- Mọi policy dựa trên `auth.uid() = user_id`. Không dùng policy `USING (true)`.
- Cột `user_id` mặc định `auth.uid()` và luôn có `WITH CHECK`.
- Vì anon key nằm trong APK, **RLS là thứ duy nhất bảo vệ dữ liệu** - không được bỏ qua.
- Sau khi tạo tài khoản của chủ, **tắt đăng ký công khai** (Disable sign ups)
  trong Supabase Auth để người lạ không tự tạo tài khoản.

## 3. Lưu trữ trên máy
- Token đăng nhập lưu bằng `expo-secure-store` (Keystore của Android),
  **không** dùng AsyncStorage cho token.
- Không log dữ liệu nhạy cảm (tên thuốc, token, email) ra `console.log` ở bản release.
- Xoá hết `console.log` debug trước khi build release.

## 4. Mạng
- Chỉ dùng HTTPS. Không bật `usesCleartextTraffic`.
- Không tắt kiểm tra SSL cho tiện debug.

## 5. Khoá app (tuỳ chọn, nên có)
- Dùng `expo-local-authentication` để mở app bằng vân tay / khuôn mặt / PIN máy.
- Mặc định bật; cho phép tắt trong Cài đặt.
- Che nội dung ở màn hình "recent apps" nếu làm được (FLAG_SECURE).

## 6. Quyền Android (principle of least privilege)
Chỉ xin những quyền thật sự cần:
- `POST_NOTIFICATIONS` (Android 13+)
- `SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` (nhắc đúng giờ)
- `RECEIVE_BOOT_COMPLETED` (đặt lại nhắc sau khi khởi động máy)
- `USE_BIOMETRIC` (nếu có khoá app)
Không xin quyền vị trí, danh bạ, bộ nhớ... nếu không cần.

## 7. Thư viện
- Chỉ thêm thư viện phổ biến, còn được bảo trì. Hỏi chủ dự án trước khi thêm thư viện lạ.
- Trước khi build release chạy `npm audit` và báo cáo kết quả.

## 8. Nếu nghi ngờ
Khi một thay đổi có thể làm lộ dữ liệu hoặc nới lỏng bảo mật: **dừng lại, giải thích
rủi ro và hỏi chủ dự án** thay vì tự quyết.
