---
description: Khởi tạo dự án từ đầu - tạo project Expo, cài thư viện, dựng theme từ Stitch, nối Supabase
---

# /bootstrap - Khởi tạo dự án

Chạy một lần khi bắt đầu. Làm lần lượt, mỗi bước xong báo ngắn gọn.

1. **Đọc bối cảnh**: đọc toàn bộ `.agent/rules/` và `design/stitch/`. Tóm tắt lại bằng 5 dòng
   cho chủ dự án xác nhận mình hiểu đúng app.

2. **Tạo project Expo (TypeScript + Expo Router)**
   - `npx create-expo-app@latest` vào thư mục hiện tại (template TypeScript / tabs)
   - Đặt `android.package` = `com.ahxian.thuoc` (hỏi chủ dự án nếu muốn tên khác)

3. **Cài thư viện cốt lõi**
   - `@supabase/supabase-js`, `expo-secure-store`, `expo-notifications`, `expo-device`,
     `expo-local-authentication`, `expo-build-properties`
   - `@tanstack/react-query`, `zod`, `date-fns`
   - 1 bộ icon và (nếu chọn) NativeWind
   - Dùng `npx expo install` để đúng phiên bản tương thích

4. **Dựng theme từ Stitch**
   - Trích màu, font, bo góc, spacing từ `design/stitch/` -> `src/theme/`
   - **Dừng lại, cho chủ dự án xem bảng màu + font đã trích và xác nhận**

5. **Nối Supabase**
   - Tạo `src/lib/supabase.ts` theo skill `supabase-secure-backend` (SecureStore adapter)
   - Tạo `.env.example` (chỉ URL + anon key, để trống giá trị) và thêm `.env` vào `.gitignore`
   - Tạo `supabase/migrations/0001_init.sql` từ skill
   - **Nhắc chủ dự án chạy SQL trong Supabase và tạo tài khoản, rồi tắt sign-up**

6. **Dựng khung điều hướng**: màn Đăng nhập + 4 tab (Hôm nay, Thuốc, Lịch sử, Cài đặt)
   với nội dung tạm, đúng phong cách Stitch.

7. **Cấu hình build**: tạo `eas.json` và cấu hình `app.json` theo skill `android-apk-release`.

8. **Kiểm tra cuối**: `npx tsc --noEmit`, `npm run lint`, app chạy được.
   Tạo `README.md` hướng dẫn chạy dự án bằng tiếng Việt, và `CHANGELOG.md`.

Báo cáo theo mẫu trong rule `02-code-style.md`.
