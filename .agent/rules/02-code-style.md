---
trigger: always_on
description: Quy ước code, cấu trúc thư mục, cách comment và giải thích cho chủ dự án
---

# Quy ước code

## Ngôn ngữ & công cụ
- TypeScript, bật `strict`. Không dùng `any` trừ khi có lý do và có comment giải thích.
- Component dạng function + hooks. Không dùng class component.
- Format bằng Prettier + ESLint. Chạy `npm run lint` và `npx tsc --noEmit` trước khi báo xong.

## Cấu trúc thư mục
```
app/                  # Expo Router (mỗi file = 1 màn hình)
  (auth)/             # đăng nhập
  (tabs)/             # các tab chính: Hôm nay, Thuốc, Lịch sử, Cài đặt
  medication/[id].tsx # chi tiết / sửa thuốc
src/
  components/         # component dùng chung (Button, Card, Chip...)
  features/
    medications/      # logic + UI riêng cho thuốc
    schedules/
    reminders/        # đặt / huỷ thông báo
    history/
  lib/
    supabase.ts       # tạo client Supabase (1 chỗ duy nhất)
    notifications.ts  # wrapper expo-notifications
    secureStorage.ts  # adapter lưu session bằng SecureStore
  theme/              # màu, font, spacing (design tokens)
  types/              # kiểu dữ liệu dùng chung
supabase/
  migrations/         # file SQL, đánh số theo thứ tự
design/stitch/        # file thiết kế export từ Stitch
```

## Quy tắc
- Mỗi file làm 1 việc. File quá ~200 dòng thì tách ra.
- Gọi Supabase **chỉ** qua các hàm trong `src/features/*/api.ts`, không gọi rải rác trong màn hình.
- Không hard-code màu / cỡ chữ trong màn hình; lấy từ `src/theme/`.
- Xử lý đủ 3 trạng thái cho mọi màn hình dùng dữ liệu: **đang tải, lỗi, rỗng**.
- Ngày giờ: lưu UTC trên server, hiển thị theo múi giờ máy. Dùng `date-fns`.
  Giờ uống thuốc lưu dạng "giờ trên đồng hồ" (ví dụ `08:00`), không đổi theo múi giờ.

## Comment & giải thích (quan trọng)
Chủ dự án là designer, không phải dev chuyên nghiệp, nên:
- Viết comment **tiếng Việt**, giải thích "vì sao" chứ không chỉ "làm gì".
- Với đoạn code khó (đặt thông báo, RLS, xử lý giờ) thêm comment 2-3 dòng giải thích ý tưởng.
- Tên biến / hàm viết tiếng Anh rõ nghĩa.

## Cách báo cáo sau khi làm xong
Trả lời ngắn gọn bằng tiếng Việt, theo mẫu:
1. **Đã làm gì** (1-3 dòng)
2. **File nào thay đổi**
3. **Cách kiểm tra** (bấm vào đâu để thấy kết quả)
4. **Lưu ý / việc cần chủ dự án làm tay** (nếu có, ví dụ chạy SQL trong Supabase)

Không dùng thuật ngữ khó mà không giải thích.

## Git
- Commit nhỏ, message tiếng Việt hoặc Anh đều được nhưng rõ nghĩa.
- Không commit `.env`, keystore, `node_modules`.
